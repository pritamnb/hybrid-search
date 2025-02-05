import express from 'express';
import { SearchController } from '../controller/searchController';
import { MagazineSearchService } from '../services/magazineSearch.service';
import { MagazineRepository } from '../repository/magazineRepository';

const router = express.Router();

const magazineRepository = new MagazineRepository();
const magazineSearchService = new MagazineSearchService(magazineRepository);
const searchController = new SearchController(magazineSearchService);

// Search by
router.get('/keyword', (req, res) => searchController.keywordSearch(req, res));
router.get('/vector', (req, res) => searchController.vectorSearch(req, res));
router.get('/hybrid', (req, res) => searchController.hybridSearch(req, res));

export default router;
