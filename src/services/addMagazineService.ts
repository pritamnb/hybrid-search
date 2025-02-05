import { MagazineRepository } from "../repository/addMagazineRepository";
import { generateEmbedding } from "../utils/embedding";
import { sequelize } from "../config/db";
import { Transaction } from 'sequelize';

export class MagazineService {
    private magazineRepo: MagazineRepository;

    constructor() {
        this.magazineRepo = new MagazineRepository();
    }

    // Get all magazines
    async getMagazines() {
        return await this.magazineRepo.getAllMagazines();
    }

    // Add a new magazine with transaction
    async addMagazine(magazineData: any) {
        // Start a transaction
        const transaction: Transaction = await sequelize.transaction();

        try {
            // Generate the content embedding
            const embedding = await this.generateAndFormatEmbedding(magazineData.content);

            // Create magazine and content entries
            const magazineInfo = await this.magazineRepo.createMagazineEntry(magazineData, transaction);
            console.log("magazineInfo :::: ", magazineInfo);

            const magazineContent = await this.magazineRepo.createMagazineContentEntry(magazineData, magazineInfo.id, embedding, transaction);
            console.log("magazineContent :::: ", magazineContent);


            await transaction.commit();

            return { magazineInfo, magazineContent };
        } catch (error) {
            await transaction.rollback();
            console.error('Error adding magazine:', error);
            throw new Error('Could not add magazine.');
        }
    }

    // Generate the embedding for content
    private async generateAndFormatEmbedding(content: string): Promise<string> {
        try {
            const embedding = await generateEmbedding(content);
            return `${embedding}`;
        } catch (error) {
            console.error('Failed to generate embedding:', error);
            throw new Error('Failed to generate embedding.');
        }
    }
}
