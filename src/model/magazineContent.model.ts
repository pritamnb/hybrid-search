import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import * as pgvector from 'pgvector/sequelize';
import MagazineInformation from './magazineInfo';

// Register pgvector type with sequelize
pgvector.registerTypes(sequelize);

class MagazineContent extends Model {
    public id!: number;
    public magazine_id!: number;
    public content!: string;
    public content_embedding!: number[];  // Assuming it's an array of numbers
    public content_tsvector!: any;  // You can adjust the type of content_tsvector based on how it's used
}

// Extend the DataTypes to include VECTOR
declare module 'sequelize' {
    interface DataTypes {
        VECTOR: (length: number) => any;
    }
}

MagazineContent.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        magazine_id: {
            type: DataTypes.BIGINT,
            references: {
                model: MagazineInformation,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        content: {
            type: DataTypes.TEXT,
        },
        content_embedding: {
            type: (DataTypes as any).VECTOR(1024),  // Use the VECTOR type
        },
        content_tsvector: {
            type: DataTypes.TSVECTOR,
        },
    },
    {
        sequelize,
        tableName: 'magazine_content',
    }
);

export default MagazineContent;