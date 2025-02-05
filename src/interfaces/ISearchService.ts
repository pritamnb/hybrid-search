// interfaces/ISearchService.ts
export interface ISearchService {
    performKeywordSearch(query: string, page: number, pageSize: number): Promise<any[]>;
    getVectorSearch(query: string, page?: number, pageSize?: number): Promise<any[]>;
    performHybridSearch(query: string, page: number, pageSize: number): Promise<any[]>;
}
