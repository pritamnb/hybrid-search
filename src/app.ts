import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import searchRoutes from './routes/searchRoutes';
import magazineRoute from './routes/magazineRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Content Security Policy middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; font-src 'self' http://localhost:3000; style-src 'self';"
    );
    next();
});

// Mount routes
app.use('/api', searchRoutes);
app.use('/api', magazineRoute);

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.send('Server is running...');
});

// Additional routes can be added here if needed

export default app;
