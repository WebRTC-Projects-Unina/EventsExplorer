import db from "../models/index.js";
const Event = db.Event;

async function getEvents(body) {
    const data = await Event.findAll(body);
    return data;
}

async function getEventById(id) {
    const data = await Event.findByPk(id);
    return data;
}

export { getEvents, getEventById };