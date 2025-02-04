import { Router } from 'express';
import { searchMagazines } from '../controller/searchController';  // Adjust path if needed

const router = Router();

router.post('/search', searchMagazines);  // Correctly using the async handler

export default router;
