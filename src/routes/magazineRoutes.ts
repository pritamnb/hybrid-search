import { Router } from 'express';
import { MagazineController } from '../controller/magazineController';
import { magazineData } from '../utils/magazine_data';
import { MagazineService } from '../services/addMagazineService';

const router = Router();
const magazineController = new MagazineController();
const magazineService = new MagazineService();
// Fetch all magazines
router.get('/magazines', magazineController.getMagazines.bind(magazineController));

// Add a new magazine
router.post('/magazine', magazineController.addMagazine.bind(magazineController));



router.get('/load-magazines', async (req, res) => {

    try {
        for (const record of magazineData) {
            await magazineService.addMagazine(record)
            console.log(`Inserted: ${record.title}`);
        }

        res.json({ message: 'Magazines loaded successfully' });
    } catch (error) {
        console.error('Error inserting magazines:', error);
        res.status(500).json({ error: 'Failed to insert magazines' });
    }
});

export default router;
