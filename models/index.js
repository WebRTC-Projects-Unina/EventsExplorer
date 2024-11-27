import Sequelize from "sequelize";
import sequelize from '../database.js';
import Location from "./location.js";
import Event from "./event.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Location = Location(sequelize, Sequelize);
db.Event = Event(sequelize, Sequelize);

db.Event.Location = db.Event.belongsTo(db.Location, { foreignKey: "locationId" });

export default db;