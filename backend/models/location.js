import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

const Location = (sequelize, Sequelize) => {
    const Location = sequelize.define('Location', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING
        }
    });
    return Location;
};

export default Location;