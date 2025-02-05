export interface IMagazineRepository {
    searchByKeyword(query: string, page: number, pageSize: number): Promise<any[]>;
    searchByVector(query: string, page: number, pageSize: number): Promise<any[]>;
}
