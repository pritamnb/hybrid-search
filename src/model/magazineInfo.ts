import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';  // Ensure this import is correctly pointing to your sequelize instance

class MagazineInformation extends Model {
    public id!: number;
    public title!: string;
    public author!: string;
    public publication_date!: Date;
    public category?: string;
}

MagazineInformation.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        publication_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        category: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        tableName: 'magazine_information',
    }
);


export default MagazineInformation;