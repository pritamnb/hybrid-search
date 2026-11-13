import { ISearchResult } from "./ISearchResult";

export interface IMagazineRepository {
    searchByKeyword(query: string, page: number, pageSize: number): Promise<ISearchResult[]>;
    searchByVector(query: string, page: number, pageSize: number): Promise<ISearchResult[]>;
}
