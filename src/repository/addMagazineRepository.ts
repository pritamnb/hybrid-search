import { Transaction } from 'sequelize';
import MagazineContent from "../model/magazineContent.model";
import { sequelize } from "../config/db";  // Assuming this is the instance of Sequelize
import MagazineInformation from '../model/magazineInfo';

export class MagazineRepository {
    // Method to get all magazines
    async getAllMagazines() {
        return await MagazineInformation.findAll();
    }

    // Create Magazine entry with transaction
    async createMagazineEntry(magazineData: any, transaction: Transaction) {
        return await MagazineInformation.create(
            {
                title: magazineData.title,
                author: magazineData.author,
                publication_date: Date.now(),
                category: magazineData.category,
            },
            { transaction }
        );
    }

    // Create MagazineContent entry with transaction
    async createMagazineContentEntry(magazineData: any, magazineId: number, embedding: string, transaction: Transaction) {
        const contentTsvector = sequelize.fn('to_tsvector', 'english', magazineData.content);
        const magazineContent = await MagazineContent.create({
            magazine_id: magazineId,
            content: magazineData.content,
            content_embedding: embedding, // Ensure this is an array of numbers
            content_tsvector: contentTsvector,
        }, { transaction });

        return magazineContent;
    }
}
