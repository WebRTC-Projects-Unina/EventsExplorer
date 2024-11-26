import log4js from 'log4js';
import Sequelize from 'sequelize';

const log = log4js.getLogger("entrypoint");
log.level = "info";
const sequelize = new Sequelize('test-db', 'user', 'pass', {
  dialect: 'sqlite',
  host: './' + process.env.DATABASE
});
sequelize.sync().then(() => log.debug("Database created"));

export default sequelize;