import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';
import { unique } from 'underscore';

const Event_Tags = (sequelize, Sequelize) => {
    const Event_Tags = sequelize.define('Event_Tags');
    return Event_Tags;
}
export default Event_Tags;