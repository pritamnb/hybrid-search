import { Request, Response } from 'express';
import Magazine from '../model/magazineInfo';
import MagazineContent from '../model/magazineContent.model';
import { generateEmbedding } from '../utils/embedding';
import { Op, Sequelize } from 'sequelize';

export const searchMagazines = async (req: Request, res: Response): Promise<any> => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query text is required' });
        }

        // Generate embedding for query text
        const vectorEmbedding = await generateEmbedding(query);

        const results = await MagazineContent.findAll({
            order: [
                [Sequelize.literal(`vector_representation <-> CAST(ARRAY[${vectorEmbedding.join(',')}] AS vector)`), 'ASC']
            ],
            limit: 10
        });

        res.json(results);
    } catch (error) {
        console.error('Hybrid Search Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
