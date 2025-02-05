import { Request, Response } from 'express';
import { MagazineService } from '../services/addMagazineService';
import { BaseController } from './baseController';

export class MagazineController extends BaseController {
    private magazineService: MagazineService;

    constructor() {
        super();
        this.magazineService = new MagazineService();
    }

    // Getting all magazines
    public async getMagazines(req: Request, res: Response): Promise<void> {
        try {
            const magazines = await this.magazineService.getMagazines();
            this.handleSuccess(res, magazines);
        } catch (error) {
            this.handleError(res, error, 'Error fetching magazines');
        }
    }

    // Adding a new magazine
    public async addMagazine(req: Request, res: Response): Promise<void> {
        try {
            const magazineData = req.body;
            const { magazineInfo } = await this.magazineService.addMagazine(magazineData);
            this.handleSuccess(res, { magazineInfo });
        } catch (error) {
            this.handleError(res, error, 'Could not add magazine.');
        }
    }
}
