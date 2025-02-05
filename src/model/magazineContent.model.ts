import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import MagazineInformation from './magazineInfo';
class MagazineContent extends Model {
    public id!: number;
    public magazine_id!: number;
    public content!: string;
    public content_embedding!: number[];
    public content_tsvector!: any;
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
        indexes: [
            {
                name: 'magazine_id_index',
                fields: ['magazine_id'],

            },
            {
                name: 'content_tsvector_index',
                fields: ['content_tsvector'],
            }
        ],
    }
);


export default MagazineContent;