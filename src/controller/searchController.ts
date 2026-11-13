import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { ResponseStatus } from "../enums/responseStatus";
import { MagazineSearchService } from "../services/magazineSearch.service";

const MAX_QUERY_LENGTH = 500;

/** Validate and normalise search query-string parameters; returns null when the query is missing or invalid. */
export const parseSearchParams = (q: Request["query"]) => {
    const query = typeof q.query === "string" ? q.query.trim() : "";
    if (!query || query.length > MAX_QUERY_LENGTH) return null;
    return {
        query,
        page: Number(q.page) || 1,
        pageSize: Number(q.pageSize) || 10,
    };
};

export class SearchController extends BaseController {
    private searchService: MagazineSearchService;

    constructor(searchService: MagazineSearchService) {
        super();
        this.searchService = searchService;
    }

    private rejectInvalid(res: Response): void {
        res.status(400).json({
            status: ResponseStatus.ERROR,
            message: `"query" is required and must be at most ${MAX_QUERY_LENGTH} characters`,
        });
    }

    public async keywordSearch(req: Request, res: Response): Promise<void> {
        const params = parseSearchParams(req.query);
        if (!params) return this.rejectInvalid(res);
        try {
            const results = await this.searchService.performKeywordSearch(params.query, params.page, params.pageSize);
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing keyword search");
        }
    }

    public async vectorSearch(req: Request, res: Response): Promise<void> {
        const params = parseSearchParams(req.query);
        if (!params) return this.rejectInvalid(res);
        try {
            const results = await this.searchService.getVectorSearch(params.query, params.page, params.pageSize);
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing vector search");
        }
    }

    public async hybridSearch(req: Request, res: Response): Promise<void> {
        const params = parseSearchParams(req.query);
        if (!params) return this.rejectInvalid(res);
        try {
            const results = await this.searchService.performHybridSearch(params.query, params.page, params.pageSize);
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing hybrid search");
        }
    }
}
