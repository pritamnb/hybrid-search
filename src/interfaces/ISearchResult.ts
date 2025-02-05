export interface ISearchResult {
    id: number;
    title: string;
    author: string;
    content: string;
    similarity_score?: number;
}
