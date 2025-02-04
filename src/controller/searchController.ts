// searchController.ts
import { Request, Response } from 'express';
import * as SearchService from '../services/magazineSearch.service';  // Import the service

// **Keyword Search**: Search based on keywords in title, author, and content.
export const keywordSearch = async (req: Request, res: Response) => {
    const { query, page, pageSize } = req.query;

    try {
        const results = await SearchService.performKeywordSearch(query as string, Number(page) || 1, Number(pageSize) || 10);
        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error || 'Error performing full-text search'
        });
    }
};

// **Vector Search**: Search based on vector similarity.
export const vectorSearch = async (req: Request, res: Response) => {
    const { query, pageSize } = req.body;  // Query will come from the body for vector search

    try {
        const results = await SearchService.getVectorSearch(query, pageSize);
        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        console.log("ERROR :: ", error);

        res.status(500).json({
            status: 'error',
            message: error || 'Error performing vector search'
        });
    }
};

// **Hybrid Search**: Combine results from both keyword and vector searches.
export const hybridSearch = async (req: Request, res: Response) => {
    const { query, page, pageSize } = req.body;  // Query comes from the body

    try {
        const results = await SearchService.performHybridSearch(query, page, pageSize);
        console.log("hybridSearch :: Controller :: results ", results);

        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error || 'Error performing hybrid search'
        });
    }
};
