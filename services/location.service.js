import log4js from 'log4js';
const log = log4js.getLogger("service:Location");
log.level = "debug";


async function getLocations(body) {
    const data = [{
        id: 1,
        name: "Schuppen",
        latitude: 50.934977,
        longitude: 10.919037,
        website: "http://hello-world.com"
    },
    {
        id: 2,
        name: "Werk",
        latitude: 50.934977,
        longitude: 10.919037,
        website: "http://hello-world.com"
    }];
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function getLocationById(id) {
    const data = {
        id: 1,
        name: "Schuppen",
        latitude: 50.934977,
        longitude: 10.919037,
        website: "http://hello-world.com"
    };
    await new Promise(r => setTimeout(r, 2000));
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