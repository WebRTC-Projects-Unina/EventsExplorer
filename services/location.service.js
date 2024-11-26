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
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function addLocation(body) {
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function updateLocation(body, id) {
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

export { updateLocation, addLocation, getLocationById, deleteLocationById, getLocations };