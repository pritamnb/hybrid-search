import { Router } from 'express';
import { hybridSearch } from '../controller/searchController';  // Adjust path if needed

const router = Router();

router.post('/search', hybridSearch);  // Correctly using the async handler

export default router;
