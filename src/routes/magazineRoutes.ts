import { Request, Response, Router } from 'express';
import pool from '../config/db';
import { addMagazine } from '../controller/magzineController';

const router = Router();

router.get('/magazines', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM magazines');
        res.json(result.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/magazines', addMagazine);

export default router;
