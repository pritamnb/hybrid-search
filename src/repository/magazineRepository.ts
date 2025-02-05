// repositories/MagazineRepository.ts
import { IMagazineRepository } from "../interfaces/IMagazineRepository";
import { ISearchResult } from "../interfaces/ISearchResult";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db";
import { generateEmbedding } from "../utils/embedding";

export class MagazineRepository implements IMagazineRepository {

    async searchByKeyword(query: string, page: number = 1, pageSize: number = 10): Promise<ISearchResult[]> {
        const offset = (page - 1) * pageSize;

        const sqlQuery = `
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mc.content
            FROM
                magazine_content mc
            JOIN
                magazine_information mi
            ON
                mi.id = mc.magazine_id
            WHERE
                (mi.title ILIKE '%${query}%' OR
                mi.author ILIKE '%${query}%' OR
                mc.content_tsvector @@ plainto_tsquery('english', :query))
            ORDER BY
                ts_rank(mc.content_tsvector, plainto_tsquery('english', :query)) DESC,
                mi.title ILIKE '%${query}%' DESC,
                mi.author ILIKE '%${query}%' DESC
            LIMIT ${pageSize}
            OFFSET ${offset}
        `;


        try {
            const results: ISearchResult[] = await sequelize.query(sqlQuery, {
                replacements: { query },
                type: QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error("Error performing keyword search:", error);
            throw new Error("Database error while performing keyword search");
        }
    }

    async searchByVector(query: string, page: number = 1, pageSize: number = 10, threshold: number = 0.8): Promise<ISearchResult[]> {
        try {
            const embedding = await generateEmbedding(query);
            const offset = (page - 1) * pageSize;
            const results = await sequelize.query(`
                SELECT
                    mi.id,
                    mi.title,
                    mi.author,
                    mc.content,
                    content_embedding <=> '${embedding}'::vector AS similarity_score
                FROM
                    magazine_content mc
                JOIN
                    magazine_information mi
                ON
                    mi.id = mc.magazine_id
                WHERE
                    content_embedding <=> '${embedding}'::vector <= ${threshold}
                ORDER BY
                    similarity_score
                LIMIT ${pageSize}
                OFFSET ${offset}
            `, {
                type: QueryTypes.SELECT,
            });


            // Filter results based on the threshold and exclude similarity_score from the response
            const filteredResults = results
                .filter((result: any) => result.similarity_score <= threshold) // Ensure similarity is within the threshold
                .map((result: any) => {
                    // Remove similarity_score before returning
                    const { similarity_score, ...rest } = result;
                    return rest; // Return the object without similarity_score
                });

            return filteredResults;
        } catch (error) {
            console.error("Vector Search Failed:", error);
            throw new Error("Error performing vector search");
        }
    }

}
