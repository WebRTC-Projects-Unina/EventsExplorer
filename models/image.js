import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

const Image = (sequelize, Sequelize) => {
    const Image = sequelize.define('Image', {
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return Image;
}
export default Image;