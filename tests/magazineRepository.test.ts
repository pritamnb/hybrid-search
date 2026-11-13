jest.mock("../src/config/db", () => ({ sequelize: { query: jest.fn().mockResolvedValue([]) } }));
jest.mock("../src/utils/embedding", () => ({ generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]) }));

import { sequelize } from "../src/config/db";
import { MagazineRepository, escapeLike, toPaging } from "../src/repository/magazineRepository";

const queryMock = sequelize.query as unknown as jest.Mock;
const malicious = "x' OR 1=1; DROP TABLE magazine_content; --";

describe("MagazineRepository", () => {
    beforeEach(() => queryMock.mockClear());

    it("keyword search never interpolates user input into SQL", async () => {
        await new MagazineRepository().searchByKeyword(malicious, 2, 5);
        const [sql, options] = queryMock.mock.calls[0];
        expect(sql).not.toContain(malicious);
        expect(sql).not.toContain("DROP TABLE");
        expect(options.replacements).toMatchObject({ query: malicious, limit: 5, offset: 5 });
    });

    it("vector search binds the embedding, threshold and paging as parameters", async () => {
        await new MagazineRepository().searchByVector(malicious, 1, 10, 0.5);
        const [sql, options] = queryMock.mock.calls[0];
        expect(sql).not.toContain(malicious);
        expect(sql).not.toContain("0.1,0.2,0.3");
        expect(options.replacements).toMatchObject({ embedding: "[0.1,0.2,0.3]", minSimilarity: 0.5, limit: 10, offset: 0 });
    });

    it("escapes LIKE wildcards so they match literally", () => {
        expect(escapeLike("50%_off\\")).toBe("50\\%\\_off\\\\");
    });

    it("clamps paging input", () => {
        expect(toPaging(-3, 10_000)).toEqual({ limit: 100, offset: 0 });
        expect(toPaging(NaN, NaN)).toEqual({ limit: 10, offset: 0 });
        expect(toPaging(3, 20)).toEqual({ limit: 20, offset: 40 });
    });
});
