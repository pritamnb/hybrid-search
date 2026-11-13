export interface ISearchResult {
    id: number;
    title: string;
    author: string;
    content: string;
    category?: string;
    /** Raw score from the underlying search: ts_rank (keyword) or cosine similarity (vector). */
    score?: number;
}
