import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import { Op } from 'sequelize';
import log4js from 'log4js';
const log = log4js.getLogger("User repository");

const User = db.User;

async function getUser(body) {
    const search = {
        where: {
            username: body.username,
            password: body.password
        }
    };

    const data = await User.findOne(search);
    return data;
}

async function addUser(body) {
    return await User.create(body);
}
async function deleteUserById(id) {
    return await User.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}
export { getUser, addUser, deleteUserById };