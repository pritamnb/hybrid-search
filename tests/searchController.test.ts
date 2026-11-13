import { parseSearchParams } from "../src/controller/searchController";

describe("parseSearchParams", () => {
    it("rejects a missing or blank query", () => {
        expect(parseSearchParams({})).toBeNull();
        expect(parseSearchParams({ query: "   " })).toBeNull();
    });
    it("rejects an overly long query", () => {
        expect(parseSearchParams({ query: "a".repeat(501) })).toBeNull();
    });
    it("trims the query and defaults paging", () => {
        expect(parseSearchParams({ query: "  ai  " })).toEqual({ query: "ai", page: 1, pageSize: 10 });
    });
});
