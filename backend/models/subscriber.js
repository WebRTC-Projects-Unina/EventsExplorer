import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

const Subscriber = (sequelize, Sequelize) => {
    const Subscriber = sequelize.define('Subscriber', {
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return Subscriber;
}
export default Subscriber;