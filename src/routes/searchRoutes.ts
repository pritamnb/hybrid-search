import { Router } from 'express';
import { vectorSearch, keywordSearch, hybridSearch } from '../controller/searchController';  // Adjust path if needed

const router = Router();

router.post('/search', vectorSearch);  // Correctly using the async handler
router.get('/search', keywordSearch);  // Correctly using the async handler
router.post('/search/hybrid', hybridSearch);  // Correctly using the async handler

export default router;
