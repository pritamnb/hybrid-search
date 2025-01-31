import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
    console.log(`Connected to PostgreSQL`);
});

pool.on('error', (err) => {
    console.error(`PostgreSQL connection error: \n ${err}`);
});

export default pool;
