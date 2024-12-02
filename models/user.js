import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';
import { unique } from 'underscore';

const User = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return User;
}
export default User;