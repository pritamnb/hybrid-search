import { IMagazineRepository } from "../interfaces/IMagazineRepository";
import { ISearchResult } from "../interfaces/ISearchResult";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db";
import { generateEmbedding } from "../utils/embedding";

export class MagazineRepository implements IMagazineRepository {
    /**
     * Searches on title, author and content 
     * paginated result
     * 
     */
    async searchByKeyword(query: string, page: number = 1, pageSize: number = 10): Promise<ISearchResult[]> {
        const offset = (page - 1) * pageSize;

        const sqlQuery = `
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mi.category,
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


    /**
     * 
     * @param threshold for retrieving relevant result 
     * @returns matched result
     */
    async searchByVector(query: string, page: number = 1, pageSize: number = 10, threshold: number = 0.2): Promise<ISearchResult[]> {
        try {
            const embedding = await generateEmbedding(query);
            const offset = (page - 1) * pageSize;


            const results = await sequelize.query(`
                SELECT
                    mi.id,
                    mi.title,
                    mi.author,
                    mc.content,
                    1-(content_embedding <=> '${embedding}'::vector) AS similarity_score
                FROM
                    magazine_content mc
                JOIN
                    magazine_information mi
                ON
                    mi.id = mc.magazine_id
                WHERE
                    (1-(content_embedding <=> '${embedding}'::vector) )>= ${threshold}

                ORDER BY
                    similarity_score DESC
                LIMIT ${pageSize}
                OFFSET ${offset}
            `, {
                type: QueryTypes.SELECT,
            });


            const filteredResults = results
                .map((result: any) => {
                    const { similarity_score, ...rest } = result;
                    return rest;
                });

            return filteredResults;
        } catch (error) {
            console.error("Vector Search Failed:", error);
            throw new Error("Error performing vector search");
        }
    }

}
