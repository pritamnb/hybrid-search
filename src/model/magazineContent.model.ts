import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import MagazineInformation from './magazineInfo';
class MagazineContent extends Model {
    public id!: number;
    public magazine_id!: number;
    public content!: string;
    public content_embedding!: number[];  // Assuming it's an array of numbers
    public content_tsvector!: any;  // You can adjust the type of content_tsvector based on how it's used
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
            type: DataTypes.STRING,
            allowNull: true,
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