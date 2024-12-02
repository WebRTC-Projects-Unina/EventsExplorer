import Sequelize from "sequelize";
import sequelize from '../database.js';
import Location from "./location.js";
import Event from "./event.js";
import Tag from "./tag.js";
import Event_Tags from "./event_tags.js";
import User from "./user.js";

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Location = Location(sequelize, Sequelize);
db.Event = Event(sequelize, Sequelize);
db.Tag = Tag(sequelize, Sequelize);
db.Event_Tags = Event_Tags(sequelize, Sequelize);
db.User = User(sequelize, Sequelize);

db.Event.belongsToMany(db.Tag, { through: db.Event_Tags });
db.Tag.belongsToMany(db.Event, { through: db.Event_Tags });
db.Event.Location = db.Event.belongsTo(db.Location, { foreignKey: "locationId" });

export default db;