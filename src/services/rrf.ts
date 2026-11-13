import { ISearchResult } from "../interfaces/ISearchResult";

export interface IFusedResult extends ISearchResult {
    /** Reciprocal Rank Fusion score (higher is better). */
    rrf_score: number;
    /** Which searches matched this document. */
    matched_by: Array<"keyword" | "vector">;
}

/**
 * Reciprocal Rank Fusion: score(d) = Σ 1 / (k + rank(d)) over every list d appears in.
 *
 * Keyword scores (ts_rank) and vector scores (cosine similarity) are on different scales,
 * so they can't be averaged directly. RRF only uses each document's rank, which makes the
 * two lists comparable, rewards documents found by both searches, and de-duplicates by id.
 * k = 60 is the constant from the original RRF paper (Cormack et al., 2009).
 */
export const reciprocalRankFusion = (
    lists: Array<{ source: "keyword" | "vector"; results: ISearchResult[] }>,
    k: number = 60,
): IFusedResult[] => {
    const fused = new Map<number, IFusedResult>();

    for (const { source, results } of lists) {
        results.forEach((result, index) => {
            const contribution = 1 / (k + index + 1);
            const existing = fused.get(result.id);
            if (existing) {
                existing.rrf_score += contribution;
                if (!existing.matched_by.includes(source)) existing.matched_by.push(source);
            } else {
                const { score: _score, ...rest } = result;
                fused.set(result.id, { ...rest, rrf_score: contribution, matched_by: [source] });
            }
        });
    }

    return [...fused.values()].sort((a, b) => b.rrf_score - a.rrf_score || a.id - b.id);
};
