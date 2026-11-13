import { ISearchResult } from "./ISearchResult";
import { IFusedResult } from "../services/rrf";

export interface ISearchService {
    performKeywordSearch(query: string, page: number, pageSize: number): Promise<ISearchResult[]>;
    getVectorSearch(query: string, page?: number, pageSize?: number): Promise<ISearchResult[]>;
    performHybridSearch(query: string, page: number, pageSize: number): Promise<IFusedResult[]>;
}
