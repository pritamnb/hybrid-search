import { Request, Response } from 'express';
import MagazineContent from '../model/magazineContent.model';
import { generateEmbedding } from '../utils/embedding';
import { Op, Sequelize } from 'sequelize';
import { fullTextSearch } from '../services/magazineSearch.service'; // assuming the search service is in searchService.ts


// Vector search 
export const searchMagazines = async (req: Request, res: Response): Promise<any> => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query text is required' });
        }

        const vectorEmbedding = await generateEmbedding(query);

        if (!vectorEmbedding || vectorEmbedding.length === 0) {
            return res.status(500).json({ error: 'Failed to generate embedding' });
        }

        const results = await MagazineContent.findAll({
            order: [
                [
                    Sequelize.literal(`
                        CAST(content_embedding AS vector) <-> CAST('${vectorEmbedding}' AS vector)
                    `),
                    'ASC'
                ]
            ],
            limit: 10
        });


        res.json(results);
    } catch (error) {
        console.error('Hybrid Search Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Magazine search 

export const keywordSearch = async (req: Request, res: Response) => {
    const { query, page, pageSize } = req.query;

    try {
        const results = await fullTextSearch(
            query as string,
            Number(page) || 1,
            Number(pageSize) || 10
        );
        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error performing full-text search',
            error
        });
    }
};