import db from "../models/index.js";
import log4js from 'log4js';
const log = log4js.getLogger("location repository");

const Location = db.Location;

async function getLocations(body) {
    const data = await Location.findAll(body);
    return data;
}

async function getLocationById(id) {
    const data = await Location.findOne({ where: { id: id } });
    return data;
}

async function addLocation(body) {
    return await Location.create(body);
}

async function updateLocation(body, id) {

    return await Location.update(body, {
        where: { id: id }
    });
}

async function deleteLocationById(id) {
    return await Location.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}

export { getLocations, getLocationById, addLocation, updateLocation, deleteLocationById };