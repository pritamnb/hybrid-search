import { Response } from "express";
import { ResponseStatus } from "../enums/responseStatus";

export class BaseController {
    protected handleSuccess(res: Response, data: any): void {
        res.json({
            status: ResponseStatus.SUCCESS,
            data
        });
    }

    protected handleError(res: Response, error: unknown, message: string): void {
        const errorMessage = error instanceof Error ? error.message : message;
        res.status(500).json({
            status: ResponseStatus.ERROR,
            message: errorMessage
        });
    }
}
