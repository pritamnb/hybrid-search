import { Router } from 'express';
import { searchMagazines, keywordSearch } from '../controller/searchController';  // Adjust path if needed

const router = Router();

router.post('/search', searchMagazines);  // Correctly using the async handler
router.get('/search', keywordSearch);  // Correctly using the async handler

export default router;
