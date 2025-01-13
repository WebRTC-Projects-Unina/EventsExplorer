import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

const Event = (sequelize, Sequelize) => {
    const Event = sequelize.define('Event', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE
        },
        description: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });
    return Event;
}
export default Event;