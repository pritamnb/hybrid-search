import { Request, Response } from 'express';
import Magazine from '../model/magazineInfo';
import MagazineContent from '../model/magazineContent.model';
import { generateEmbedding } from '../utils/embedding';
import { Op, Sequelize } from 'sequelize';
import MagazineInformation from '../model/magazineInfo';
import sequelize from 'sequelize';


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

export const keywordSearch = async (req: Request, res: Response): Promise<any> => {
    const { keyword } = req.query;  // Get the search keyword from the request query

    if (!keyword) {
        return res.status(400).json({ error: "Keyword is required for search." });
    }

    try {
        // Perform a search across title, author, and content fields using full-text search
        const magazines = await MagazineInformation.findAll({
            where: {
                [Op.or]: [
                    sequelize.where(sequelize.fn('to_tsvector', 'english', sequelize.col('title')), {
                        [Op.match]: sequelize.fn('plainto_tsquery', 'english', keyword)
                    }),
                    sequelize.where(sequelize.fn('to_tsvector', 'english', sequelize.col('author')), {
                        [Op.match]: sequelize.fn('plainto_tsquery', 'english', keyword)
                    }),
                    sequelize.where(sequelize.fn('to_tsvector', 'english', sequelize.col('MagazineContent.content')), {
                        [Op.match]: sequelize.fn('plainto_tsquery', 'english', keyword)
                    })
                ]
            },
            include: [
                {
                    model: MagazineContent,
                    required: true, // Ensures MagazineContent is included in the result
                    attributes: ['content']  // Only fetch the content field from MagazineContent
                }
            ],
            limit: 10, // Optional: Add pagination if needed
        });

        if (magazines.length === 0) {
            return res.status(404).json({ message: 'No magazines found matching the search criteria.' });
        }

        // Send back the found magazines
        return res.status(200).json(magazines);

    } catch (error) {
        console.error("Error during search:", error);
        return res.status(500).json({ error: 'Error performing the search.' });
    }
};