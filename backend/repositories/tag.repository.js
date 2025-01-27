import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import { Op } from 'sequelize';
import log4js from 'log4js';
const log = log4js.getLogger("tag repository");

const Tag = db.Tag;

async function getTags(query) {
    let text = query.search ?? '';
    console.log(text);
    const search = {
        where: {
            name: { [Op.like]: '%' + text + '%' },
        },
        exclude: ['createdAt', 'updatedAt']

    };
    const data = await Tag.findAll(search);
    return data;
}

async function addTag(body) {
    return await Tag.create(body);
}
async function deleteTagById(id) {
    return await Tag.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}
export { getTags, addTag, deleteTagById };