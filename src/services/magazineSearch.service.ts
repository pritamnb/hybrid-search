import { ISearchService } from "../interfaces/ISearchService";
import { IMagazineRepository } from "../interfaces/IMagazineRepository";
import { ISearchResult } from "../interfaces/ISearchResult";
import { IFusedResult, reciprocalRankFusion } from "./rrf";

/** How many candidates each search contributes before fusion (per page requested). */
const CANDIDATE_MULTIPLIER = 3;
const MAX_CANDIDATES = 100;

export class MagazineSearchService implements ISearchService {
    private repository: IMagazineRepository;

    constructor(repository: IMagazineRepository) {
        this.repository = repository;
    }

    /** Keyword (title, author, full-text content) search, paginated. */
    async performKeywordSearch(query: string, page: number = 1, pageSize: number = 10): Promise<ISearchResult[]> {
        return this.repository.searchByKeyword(query, page, pageSize);
    }

    /** Semantic search on content embeddings, paginated. */
    async getVectorSearch(query: string, page: number = 1, pageSize: number = 10): Promise<ISearchResult[]> {
        return this.repository.searchByVector(query, page, pageSize);
    }

    /**
     * Hybrid search: fetch top candidates from both searches, fuse them with Reciprocal Rank Fusion
     * (one ranking, no duplicates), then paginate the fused list so pages stay consistent.
     */
    async performHybridSearch(query: string, page: number = 1, pageSize: number = 10): Promise<IFusedResult[]> {
        const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
        const safeSize = Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : 10;
        const candidates = Math.min(safePage * safeSize * CANDIDATE_MULTIPLIER, MAX_CANDIDATES);

        const [keywordResults, vectorResults] = await Promise.all([
            this.repository.searchByKeyword(query, 1, candidates),
            this.repository.searchByVector(query, 1, candidates),
        ]);

        const fused = reciprocalRankFusion([
            { source: "keyword", results: keywordResults },
            { source: "vector", results: vectorResults },
        ]);

        const start = (safePage - 1) * safeSize;
        return fused.slice(start, start + safeSize);
    }
}
