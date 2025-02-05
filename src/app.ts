import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import searchRoutes from './routes/searchRoutes';
import magazineRoute from './routes/magazineRoutes';

const app = express();
// Cross origin resource sharing access for frontend api hit
app.use(cors());
// json content parse from payload
app.use(bodyParser.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ${req.method} ${req.url}`);
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

// routes
// All search routes goes here
app.use('/api/search', searchRoutes);

// all add magazine routes goes here
app.use('/api', magazineRoute);

// Health check route
app.get('/health', (res: Response) => {
    res.send('Server is running...');
});


export default app;
