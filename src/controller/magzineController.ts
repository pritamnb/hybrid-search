import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * Adds a new magazine to the database.
 */
export const addMagazine = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, author, description, publication_date } = req.body;

        // Validate the input
        if (!title || !author || !description || !publication_date) {
            return res.status(400).json({ error: "All fields (title, author, description, publication_date) are required." });
        }

        // SQL query to insert a new magazine
        const sql = `
            INSERT INTO magazines (title, author, description, publication_date)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;

        const values = [title, author, description, publication_date];

        // Execute the query
        const result = await pool.query(sql, values);

        // Return the newly added magazine
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding magazine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
