// magazineSearch.service.ts
import { QueryTypes, Sequelize, Op } from 'sequelize';
import { sequelize } from '../config/db';
import MagazineContent from '../model/magazineContent.model';
import { generateEmbedding } from '../utils/embedding';

// Full-text search service
async function fullTextSearch(query: string, page = 1, pageSize = 10) {
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

        const results = await sequelize.query(sqlQuery, {
            replacements: { query },
            type: QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error performing full-text search:', error);
        throw error;
    }
}
export const performKeywordSearch = async (query: string, page: number, pageSize: number) => {
    try {
        return await fullTextSearch(query, page, pageSize);
    } catch (error) {
        throw new Error('Error performing full-text search');
    }
};

export const getVectorSearch = async (query: string, page: number = 1, pageSize: number = 10, threshold: number = 0.8) => {
    console.log("getVectorSearch :: query :: ", query);

    try {
        // Generate embedding for the search query
        const embedding = await generateEmbedding(query); // Assuming you have an embedder function to generate the embedding

        const offset = (page - 1) * pageSize; // Pagination logic

        // SQL Query with threshold applied
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

        console.log("results :: ", results);

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
        console.error('Vector Search Failed:', error);
        throw new Error('Error performing vector search');
    }
};

/*

*/
// **Hybrid Search**: Combine results from both keyword and vector searches.
export const performHybridSearch = async (query: string, page: number, pageSize: number) => {
    console.log("performHybridSearch :: query :: ", query);

    try {
        if (!query) {
            throw new Error('Query text is required');
        }

        // Perform full-text search
        const keywordResults = await performKeywordSearch(query, page, pageSize);

        // Perform vector search
        const vectorResults = await getVectorSearch(query, page, pageSize);
        console.log("vectorResults :: ", vectorResults);

        // Combine both results
        return mergeResults(keywordResults, vectorResults);
    } catch (error) {
        throw new Error('Error performing hybrid search');
    }
};

// Merge results from both keyword and vector search
function mergeResults(keywordResults: any[], vectorResults: any[]) {
    // Combine the results, prioritizing vector search first (if applicable)
    const mergedResults = [...vectorResults, ...keywordResults];

    // Optionally, deduplicate or further rank results here
    return mergedResults;
}