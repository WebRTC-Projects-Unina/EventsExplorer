import log4js from 'log4js';
import * as locationRepository from '../repositories/location.repository.js';
const log = log4js.getLogger("service:Location");
log.level = "debug";


async function getLocations(body) {
    const data = locationRepository.getLocations(body);
    return data;
}

async function getLocationById(id) {
    const data = await locationRepository.getLocationById(id);
    return data;
}

async function deleteLocationById(id) {
    return await locationRepository.deleteLocationById(id);
}

async function addLocation(body) {
    validateLocation(body);
    return await locationRepository.addLocation(body);
}

async function updateLocation(body, id) {
    return await locationRepository.updateLocation(body, id);
}

function validateLocation(body) {

    if (!body.name) {
        throw new ValidationError("Name is missing");
    }
    if (!body.latitude) {
        throw new ValidationError("Latitude is missing.");
    }
    if (!body.longitude) {
        throw new ValidationError("Longitude is missing");
    }
}

export { updateLocation, addLocation, getLocationById, deleteLocationById, getLocations };