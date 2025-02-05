import { ISearchService } from "../interfaces/ISearchService";
import { IMagazineRepository } from "../interfaces/IMagazineRepository";

export class MagazineSearchService implements ISearchService {
    private repository: IMagazineRepository;

    constructor(repository: IMagazineRepository) {
        this.repository = repository;
    }

    async performKeywordSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        return await this.repository.searchByKeyword(query, page, pageSize);
    }

    async getVectorSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        return await this.repository.searchByVector(query, page, pageSize);
    }

    async performHybridSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        const keywordResults = await this.performKeywordSearch(query, page, pageSize);
        const vectorResults = await this.getVectorSearch(query, page, pageSize);

        return [...vectorResults, ...keywordResults]; // Merge results
    }
}
