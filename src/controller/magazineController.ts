import { Request, Response } from 'express';
import Magazine from '../model/magazineInfo'; // Import Magazine model

// Get all magazines
export const getMagazines = async (req: Request, res: Response): Promise<any> => {
    try {
        const magazines = await Magazine.findAll();
        res.json(magazines);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add a new magazine
export const addMagazine = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, author, content } = req.body;

        if (!title || !author || !content) {
            return res.status(400).json({ error: 'Title, author, and content are required' });
        }

        const newMagazine = await Magazine.create({ title, author, content });
        res.status(201).json(newMagazine);
    } catch (error) {
        console.error('Error adding magazine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
