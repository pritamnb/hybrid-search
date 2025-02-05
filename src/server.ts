import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/db';
import app from './app';

dotenv.config();

const initDB = async () => {
    await connectDB();
    await sequelize.sync({ force: false })
        .then(async () => {
            console.log('Database synced!');
            await sequelize.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

            // Alter column content_embedding
            await sequelize.query(`
            ALTER TABLE magazine_content
            ALTER COLUMN content_embedding TYPE vector(1024)
            USING content_embedding::vector(1024);
        `);

            // Index for vector search
            await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_content_embedding
            ON magazine_content USING hnsw (content_embedding vector_cosine_ops);
        `);

            // Full-text search indexing
            await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_content_tsvector
            ON magazine_content USING GIN (content_tsvector);
        `);
        })
        .catch((error) => {
            console.error('Error syncing the database:', error);
        });
};

initDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
