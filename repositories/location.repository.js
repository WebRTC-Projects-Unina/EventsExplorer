import db from "../models/index.js";
import DummyLocations from "../config/locations.json" with { type: "json" };

const Location = db.Location;

async function getLocations(body) {
    console.log(DummyLocations[0].name);
    await Location.create(DummyLocations[0]);
    const data = await Location.findAll(body);
    return data;
}

async function getLocationById(id) {
    const data = await Location.findByPk(id);
    return data;
}

export { getLocations, getLocationById };