import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/db';
import app from './app'; // Import the configured app

dotenv.config();

// Initialize the database and sync models
const initDB = async () => {
    await connectDB();
    await sequelize.sync({ force: false })
        .then(async () => {
            console.log('Database synced!');
            // await sequelize.query('ALTER TABLE magazine_content ALTER COLUMN content_embedding TYPE vector(1024);');
            await sequelize.query(`
                ALTER TABLE magazine_content
                ALTER COLUMN content_embedding TYPE vector(1024)
                USING content_embedding::vector(1024);
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
