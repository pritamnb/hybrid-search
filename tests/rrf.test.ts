import { reciprocalRankFusion } from "../src/services/rrf";
import { ISearchResult } from "../src/interfaces/ISearchResult";

const doc = (id: number, score = 0): ISearchResult => ({ id, title: `t${id}`, author: "a", content: "c", score });

describe("reciprocalRankFusion", () => {
    it("ranks documents found by both searches above documents found by one", () => {
        const fused = reciprocalRankFusion([
            { source: "keyword", results: [doc(1), doc(2)] },
            { source: "vector", results: [doc(3), doc(2)] },
        ]);
        expect(fused[0].id).toBe(2);
        expect(fused[0].matched_by.sort()).toEqual(["keyword", "vector"]);
    });

    it("de-duplicates by id", () => {
        const fused = reciprocalRankFusion([
            { source: "keyword", results: [doc(1), doc(2)] },
            { source: "vector", results: [doc(1), doc(2)] },
        ]);
        expect(fused.map((r) => r.id)).toEqual([1, 2]);
    });

    it("uses ranks, not raw scores, so different score scales don't dominate", () => {
        const fused = reciprocalRankFusion([
            { source: "keyword", results: [doc(1, 0.01)] },
            { source: "vector", results: [doc(2, 0.99)] },
        ]);
        expect(fused[0].rrf_score).toBeCloseTo(fused[1].rrf_score);
        expect(fused.map((r) => r.id)).toEqual([1, 2]);
    });

    it("computes 1/(k+rank) and drops the raw score", () => {
        const [first] = reciprocalRankFusion([{ source: "vector", results: [doc(7, 0.9)] }], 60);
        expect(first.rrf_score).toBeCloseTo(1 / 61);
        expect(first).not.toHaveProperty("score");
    });

    it("returns an empty list for empty inputs", () => {
        expect(reciprocalRankFusion([{ source: "keyword", results: [] }])).toEqual([]);
    });
});
