import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import log4js from 'log4js';
const log = log4js.getLogger("Image repository");
const Image = db.Image;

async function getImage(body) {
    const search = {
        where: {
            Imagename: body.Imagename,
            password: body.password
        }
    };

    const data = await Image.findOne(search);
    return data;
}

async function addImage(body) {
    return await Image.create(body);
}
async function deleteImageById(id) {
    return await Image.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}
export { getImage, addImage, deleteImageById };