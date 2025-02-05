import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { MagazineSearchService } from "../services/magazineSearch.service";

export class SearchController extends BaseController {
    private searchService: MagazineSearchService;

    constructor(searchService: MagazineSearchService) {
        super();
        this.searchService = searchService;
    }

    public async keywordSearch(req: Request, res: Response): Promise<void> {
        const { query, page, pageSize } = req.query;

        try {
            const results = await this.searchService.performKeywordSearch(
                query as string,
                Number(page) || 1,
                Number(pageSize) || 10
            );
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing keyword search");
        }
    }

    public async vectorSearch(req: Request, res: Response): Promise<void> {
        const { query, page, pageSize } = req.body;

        try {
            const results = await this.searchService.getVectorSearch(
                query,
                Number(page) || 1,
                Number(pageSize) || 10
            );
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing vector search");
        }
    }

    public async hybridSearch(req: Request, res: Response): Promise<void> {
        const { query, page, pageSize } = req.body;

        try {
            const results = await this.searchService.performHybridSearch(
                query,
                Number(page) || 1,
                Number(pageSize) || 10
            );
            this.handleSuccess(res, results);
        } catch (error: unknown) {
            this.handleError(res, error, "Error performing hybrid search");
        }
    }
}
