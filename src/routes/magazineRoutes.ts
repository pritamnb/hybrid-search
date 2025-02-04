import { Router } from 'express';
import { getMagazines, addMagazine } from '../controller/magazineController';

const router = Router();

// Fetch all magazines
router.get('/magazines', getMagazines);

// Add a new magazine
router.post('/magazine', addMagazine);

// router.post('/add-magazines', addMagazinesBulk);

export default router;
