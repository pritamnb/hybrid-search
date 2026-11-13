import { MagazineSearchService } from "../src/services/magazineSearch.service";
import { IMagazineRepository } from "../src/interfaces/IMagazineRepository";
import { ISearchResult } from "../src/interfaces/ISearchResult";

const doc = (id: number): ISearchResult => ({ id, title: `t${id}`, author: "a", content: "c" });

describe("MagazineSearchService.performHybridSearch", () => {
    const repo: IMagazineRepository = {
        searchByKeyword: jest.fn().mockResolvedValue([doc(1), doc(2), doc(3)]),
        searchByVector: jest.fn().mockResolvedValue([doc(2), doc(4), doc(5)]),
    };
    const service = new MagazineSearchService(repo);

    it("returns one fused, de-duplicated ranking", async () => {
        const results = await service.performHybridSearch("q", 1, 10);
        expect(results.map((r) => r.id)).toEqual([2, 1, 4, 3, 5]);
        expect(new Set(results.map((r) => r.id)).size).toBe(results.length);
    });

    it("paginates the fused list consistently", async () => {
        const page1 = await service.performHybridSearch("q", 1, 2);
        const page2 = await service.performHybridSearch("q", 2, 2);
        expect(page1.map((r) => r.id)).toEqual([2, 1]);
        expect(page2.map((r) => r.id)).toEqual([4, 3]);
    });

    it("fetches candidates from page 1 of both searches", async () => {
        await service.performHybridSearch("q", 2, 5);
        expect(repo.searchByKeyword).toHaveBeenLastCalledWith("q", 1, 30);
        expect(repo.searchByVector).toHaveBeenLastCalledWith("q", 1, 30);
    });
});
