import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';
import { unique } from 'underscore';

const Tag = (sequelize, Sequelize) => {
    const Tag = sequelize.define('Tag', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return Tag;
}
export default Tag;