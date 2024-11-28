import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import log4js from 'log4js';
const log = log4js.getLogger("event repository");

const Event = db.Event;

async function getEvents(body) {
    const data = await Event.findAll(body);
    return data;
}

async function getEventById(id) {
    const data = await Event.findByPk(id);
    return data;
}

async function addEvent(body) {
    return await Event.create(body);
}

async function updateEvent(body, id) {
    return await Event.update(body, {
        where: {
            id: id
        }
    });
}

async function deleteEventById(id) {
    Event.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}

export { getEvents, getEventById, deleteEventById, addEvent, updateEvent };