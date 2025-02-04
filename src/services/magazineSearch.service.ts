import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';

export async function fullTextSearch(query: string, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    try {
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
                -- Search for the query in title, author, or content
                (mi.title ILIKE '%${query}%' OR
                mi.author ILIKE '%${query}%' OR
                mc.content_tsvector @@ plainto_tsquery('english', :query))
            ORDER BY
                -- Ranking by full-text search relevance
                ts_rank(mc.content_tsvector, plainto_tsquery('english', :query)) DESC,
                -- Also sort by title and author relevance if necessary
                mi.title ILIKE '%${query}%' DESC,
                mi.author ILIKE '%${query}%' DESC
            LIMIT ${pageSize}
            OFFSET ${offset}
        `;

        const results = await sequelize.query(sqlQuery, {
            replacements: { query },
            type: QueryTypes.SELECT
        });

        console.log(results);
        return results;
    } catch (error) {
        console.error('Error performing full-text search:', error);
        throw error;
    }
}
