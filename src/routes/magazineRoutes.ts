import { Router } from 'express';
import { MagazineController } from '../controller/magazineController';
import { magazineData } from '../utils/magazine_data';
import { MagazineService } from '../services/addMagazineService';
import { generateFakeMagazines } from '../utils/fakeData';

const router = Router();
const magazineController = new MagazineController();
const magazineService = new MagazineService();
// Fetch all magazines
router.get('/magazines', magazineController.getMagazines.bind(magazineController));

// Add a single new magazine
router.post('/magazine', magazineController.addMagazine.bind(magazineController));


/**
 * Recommended data load
 * Load meaningful magazines 
 * "magazineData" contains real data
 */
router.get('/load-magazines', async (req, res) => {

    try {
        for (const record of magazineData) {
            await magazineService.addMagazine(record)
            console.info(`Inserted: ${record.title}`);
        }

        res.json({ message: 'Magazines loaded successfully' });
    } catch (error) {
        console.error('Error inserting magazines:', error);
        res.status(500).json({ error: 'Failed to insert magazines' });
    }
});

/**
 * To load fake data
 */
router.get("/load-fake-magazines", async (req, res) => {
    try {
        const fakeMagazines = generateFakeMagazines(20); // Generate 20 fake records

        for (const record of fakeMagazines) {
            await magazineService.addMagazine(record);
            console.info(`Inserted: ${record.title}`);
        }

        res.json({ message: "Fake magazines loaded successfully" });
    } catch (error) {
        console.error("Error inserting fake magazines:", error);
        res.status(500).json({ error: "Failed to insert fake magazines" });
    }
});

export default router;
