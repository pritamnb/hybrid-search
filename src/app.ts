import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import searchRoutes from './routes/searchRoutes';
import magzineRoute from './routes/magazineRoutes';


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' http://localhost:3000; style-src 'self';");
    next();
});


app.use('/api', searchRoutes);
app.use('/api', magzineRoute);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
export default app;
