import { Request, Response } from 'express';
import Magazine from '../model/magazineInfo'; // Import Magazine model
import { generateEmbedding } from '../utils/embedding';
import MagazineContent from '../model/magazineContent.model';
import sequelize from 'sequelize';
import MagazineInformation from '../model/magazineInfo';

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
import { Transaction } from 'sequelize';

interface MagazineData {
    title: string;
    author: string;
    content: string;
    category: string;
}

interface Embedding {
    embedding: number[];
}


export const addMagazine = async (req: Request, res: Response): Promise<any> => {
    console.log("magazineData :: " + JSON.stringify(req.body));

    // Check if sequelize is defined before using it
    if (!MagazineInformation.sequelize) {
        throw new Error('Sequelize instance is not available.');
    }

    const transaction: Transaction = await MagazineInformation.sequelize.transaction();

    try {
        const magazineData: MagazineData = req.body;

        // Generate the embedding for the content
        const embedding: string = await generateEmbedding(magazineData.content);
        // console.log(typeof JSON.parse(embedding.toString()));

        console.log("\n embedding :: ", typeof embedding, '\n', embedding);


        try {
            // Create a new entry in the magazine information table
            const magazineInfo = await MagazineInformation.create({
                title: magazineData.title,
                author: magazineData.author,
                publication_date: Date.now(),
                category: magazineData.category,
            }, { transaction });

            console.log("id: " + magazineInfo.id);

            // Use sequelize.fn to create the content_tsvector expression
            const contentTsvector = sequelize.fn('to_tsvector', 'english', magazineData.content);

            // Create a new entry in the magazine content table with embedding and tsvector
            const magazineContent = await MagazineContent.create({
                magazine_id: magazineInfo.id,
                content: magazineData.content,
                content_embedding: embedding, // Ensure this is an array of numbers
                content_tsvector: contentTsvector,
            }, { transaction });

            // Commit the transaction if everything is successful
            await transaction.commit();

            // Respond with the created magazine information and content
            return res.status(200).json({
                magazineInfo,
                magazineContent
            });

        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            console.error('Error adding magazine:', error);
            return res.status(500).json({ error: 'Could not add magazine.' });
        }

    } catch (error) {
        console.error('Failed to generate embedding while adding magazine', error);
        return res.status(500).json({ error: 'Failed to generate embedding.' });
    }
};




// export const addMagazine = async (req: Request, res: Response): Promise<any> => {
//     console.log("magazineData :: " + JSON.stringify(req.body));

//     if (!MagazineInformation.sequelize) {
//         return res.status(500).json({ error: 'Sequelize instance is not available.' });
//     }

//     const transaction: Transaction = await MagazineInformation.sequelize.transaction();

//     try {
//         const magazineData: MagazineData = req.body;

//         // Generate embedding
//         const embedding = await generateAndFormatEmbedding(magazineData.content);
//         console.log("\n embedding :: ", typeof embedding, '\n', embedding);

//         // Create magazine entry
//         const magazineInfo = await createMagazineEntry(magazineData, transaction);
//         console.log("id: " + magazineInfo.id);

//         // Create magazine content entry
//         const magazineContent = await createMagazineContentEntry(magazineData, magazineInfo.id, embedding, transaction);

//         // Commit the transaction
//         await transaction.commit();

//         return res.status(200).json({ magazineInfo, magazineContent });
//     } catch (error) {
//         await transaction.rollback();
//         console.error('Error adding magazine:', error);
//         return res.status(500).json({ error: 'Could not add magazine.' });
//     }
// };

/**
 * Generates the embedding for given content and formats it properly for storage.
 */
const generateAndFormatEmbedding = async (content: string): Promise<string> => {
    try {
        const embedding: string = await generateEmbedding(content);
        return `'[${embedding}]'`; // Ensure it is properly formatted as a PostgreSQL vector
    } catch (error) {
        console.error('Failed to generate embedding:', error);
        throw new Error('Failed to generate embedding.');
    }
};

/**
 * Creates an entry in the MagazineInformation table.
 */
const createMagazineEntry = async (magazineData: MagazineData, transaction: Transaction) => {
    return await MagazineInformation.create({
        title: magazineData.title,
        author: magazineData.author,
        publication_date: new Date(),
        category: magazineData.category,
    }, { transaction });
};

/**
 * Creates an entry in the MagazineContent table.
 */
const createMagazineContentEntry = async (
    magazineData: MagazineData,
    magazineId: number,
    embedding: string,
    transaction: Transaction
) => {
    return await MagazineContent.create({
        magazine_id: magazineId,
        content: magazineData.content,
        content_embedding: embedding,
        content_tsvector: sequelize.fn('to_tsvector', 'english', magazineData.content),
    }, { transaction });
};
