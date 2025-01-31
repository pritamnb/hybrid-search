import { Request, Response } from 'express';
import pool from '../config/db';  // Database connection
import { generateEmbedding } from '../utils/embedding';  // Embedding generation function

export const hybridSearch = async (req: Request, res: Response): Promise<any> => {
    try {
        const { query } = req.body;

        // Check if the query parameter is provided
        if (!query) return res.status(400).json({ error: "Query is required" });

        // Generate the vector embedding for the input query
        const vectorEmbedding = await generateEmbedding(query);

        // SQL query that combines keyword search (ILIKE) and vector search (<->)
        const sql = `
            SELECT m.*, mc.content, mc.vector_representation <-> $1 AS similarity
            FROM magazines m
            JOIN magazine_contents mc ON m.id = mc.magazine_id
            WHERE m.title ILIKE $2 OR m.author ILIKE $2 OR mc.content ILIKE $2
            ORDER BY similarity ASC
            LIMIT 10;
        `;

        // Execute the SQL query
        const result = await pool.query(sql, [vectorEmbedding, `%${query}%`]);

        // Return the search results as a JSON response
        return res.json(result.rows);
    } catch (error) {
        // Log the error and return a 500 status code if an exception occurs
        console.error("Hybrid Search Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
