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
        console.log("rows deleted:" + rowsDeleted);
    });
}

export { getEvents, getEventById, deleteEventById, addEvent, updateEvent };