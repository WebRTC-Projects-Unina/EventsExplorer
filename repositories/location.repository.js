import db from "../models/index.js";

const Location = db.Location;

async function getLocations(body) {
    const data = await Location.findAll(body);
    return data;
}

async function getLocationById(id) {
    const data = await Location.findByPk(id);
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
    });
}

export { getLocations, getLocationById, addLocation, updateLocation, deleteLocationById };