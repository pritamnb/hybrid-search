import { Sequelize } from 'sequelize';
import { Client } from 'pg';

const postgresClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
});

const createDatabaseIfNotExists = async (dbName: string) => {
    try {
        // Connect to the PostgreSQL server
        await postgresClient.connect();

        // Verify if the database exists
        const res = await postgresClient.query(
            `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
        );

        // Create the database if it doesn't exist
        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" does not exist. Creating it...`);
            await postgresClient.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }

        // Close the connection
        await postgresClient.end();
    } catch (error) {
        console.error('Error checking/creating the database:', error);
    }
};

const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'magazine_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        // Ensure the database exists
        await createDatabaseIfNotExists(process.env.DB_NAME || 'magazine_db');

        // Authenticate with the database
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Ensure the vector extension exists in the database
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('Vector extension ensured.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, connectDB };
