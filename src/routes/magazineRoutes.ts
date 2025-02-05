import { Router } from 'express';
import { MagazineController } from '../controller/magazineController';

const router = Router();
const magazineController = new MagazineController();

// Fetch all magazines
router.get('/magazines', magazineController.getMagazines.bind(magazineController));

// Add a new magazine
router.post('/magazine', magazineController.addMagazine.bind(magazineController));

export default router;
