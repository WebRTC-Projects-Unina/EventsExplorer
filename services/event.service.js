import log4js from 'log4js';
import * as eventRepository from '../repositories/event.repository.js';

const log = log4js.getLogger("service:event");
log.level = "debug";


async function getEvents(body) {
    const data = eventRepository.getEvents(body);
    return data;

}

async function getEventById(id) {
    const data = {
        id: 1,
        name: "test",
        locationId: 1,
        description: "bla"
    };
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function deleteEventById(id) {
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function addEvent(body) {
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

async function updateEvent(body, id) {
    const data = null;
    await new Promise(r => setTimeout(r, 2000));
    return data;
}

export { updateEvent, addEvent, getEventById, deleteEventById, getEvents };