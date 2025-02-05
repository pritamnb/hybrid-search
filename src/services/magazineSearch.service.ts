import { ISearchService } from "../interfaces/ISearchService";
import { IMagazineRepository } from "../interfaces/IMagazineRepository";

export class MagazineSearchService implements ISearchService {
    private repository: IMagazineRepository;

    constructor(repository: IMagazineRepository) {
        this.repository = repository;
    }
    /**
     * 
     * @param query keyword
     * @param page start
     * @param pageSize size
     * @returns total matched objects from title, author and content
     */
    async performKeywordSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        return await this.repository.searchByKeyword(query, page, pageSize);
    }

    /**
     * 
     * @param query string
     * @param page start
     * @param pageSize size
     * @returns Search based on vector similarity in the content embedding
field.
     */
    async getVectorSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        return await this.repository.searchByVector(query, page, pageSize);
    }

    /**
     * 
     * @param query string to search in both keyword and vector search
     * @param page start
     * @param pageSize size
     * @returns combined result from both keyword and vector search
     */
    async performHybridSearch(query: string, page: number = 1, pageSize: number = 10): Promise<any[]> {
        const keywordResults = await this.performKeywordSearch(query, page, pageSize);
        const vectorResults = await this.getVectorSearch(query, page, pageSize);

        return [...vectorResults, ...keywordResults]; // Merge results
    }
}
