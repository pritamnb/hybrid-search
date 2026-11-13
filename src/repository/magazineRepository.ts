import { IMagazineRepository } from "../interfaces/IMagazineRepository";
import { ISearchResult } from "../interfaces/ISearchResult";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db";
import { generateEmbedding } from "../utils/embedding";

const MAX_PAGE_SIZE = 100;

/** Clamp paging input so callers can never send unbounded or negative values to the database. */
export const toPaging = (page: number, pageSize: number) => {
    const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
    const safeSize = Number.isFinite(pageSize) && pageSize >= 1 ? Math.min(Math.floor(pageSize), MAX_PAGE_SIZE) : 10;
    return { limit: safeSize, offset: (safePage - 1) * safeSize };
};

/** Escape LIKE wildcards so user input is matched literally inside ILIKE patterns. */
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

export class MagazineRepository implements IMagazineRepository {
    /**
     * Keyword search over title, author and content (full-text).
     * Every user-supplied value is passed as a bound parameter, never interpolated into SQL.
     */
    async searchByKeyword(query: string, page: number = 1, pageSize: number = 10): Promise<ISearchResult[]> {
        const { limit, offset } = toPaging(page, pageSize);
        const like = `%${escapeLike(query)}%`;

        const sqlQuery = `
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mi.category,
                mc.content,
                ts_rank(mc.content_tsvector, plainto_tsquery('english', :query)) AS score
            FROM
                magazine_content mc
            JOIN
                magazine_information mi
            ON
                mi.id = mc.magazine_id
            WHERE
                (mi.title ILIKE :like OR
                mi.author ILIKE :like OR
                mc.content_tsvector @@ plainto_tsquery('english', :query))
            ORDER BY
                score DESC,
                (mi.title ILIKE :like) DESC,
                (mi.author ILIKE :like) DESC,
                mi.id ASC
            LIMIT :limit
            OFFSET :offset
        `;

        try {
            return await sequelize.query<ISearchResult>(sqlQuery, {
                replacements: { query, like, limit, offset },
                type: QueryTypes.SELECT,
            });
        } catch (error) {
            console.error("Error performing keyword search:", error);
            throw new Error("Database error while performing keyword search");
        }
    }

    /**
     * Semantic search: cosine similarity between the query embedding and stored content embeddings.
     * @param threshold minimum similarity (0-1) for a result to be returned
     */
    async searchByVector(query: string, page: number = 1, pageSize: number = 10, threshold: number = 0.2): Promise<ISearchResult[]> {
        const { limit, offset } = toPaging(page, pageSize);
        const minSimilarity = Number.isFinite(threshold) ? Math.min(Math.max(threshold, 0), 1) : 0.2;
        const embedding = await generateEmbedding(query);

        const sqlQuery = `
            SELECT
                mi.id,
                mi.title,
                mi.author,
                mc.content,
                1 - (mc.content_embedding <=> CAST(:embedding AS vector)) AS score
            FROM
                magazine_content mc
            JOIN
                magazine_information mi
            ON
                mi.id = mc.magazine_id
            WHERE
                1 - (mc.content_embedding <=> CAST(:embedding AS vector)) >= :minSimilarity
            ORDER BY
                score DESC,
                mi.id ASC
            LIMIT :limit
            OFFSET :offset
        `;

        try {
            return await sequelize.query<ISearchResult>(sqlQuery, {
                replacements: { embedding: JSON.stringify(embedding), minSimilarity, limit, offset },
                type: QueryTypes.SELECT,
            });
        } catch (error) {
            console.error("Vector search failed:", error);
            throw new Error("Error performing vector search");
        }
    }
}
