import Sequelize from "sequelize";
import sequelize from '../database.js';
import Location from "./location.js";
import Event from "./event.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Location = Location(sequelize, Sequelize);
db.Event = Event(sequelize, Sequelize);

export default db;