import log4js from 'log4js';
import * as eventRepository from '../repositories/event.repository.js';
import { ValidationError } from '../middleware/errorHandler.js';


const log = log4js.getLogger("service:event");
log.level = "debug";


async function getEvents(body) {
    const data = await eventRepository.getEvents(body);
    data.forEach(element => {
        if (element.Image == null) {
            element.Image = { filename: 'http://localhost:3000/images/noflyer.png' };
        }
        else {
            element.Image.filename = 'http://localhost:3000/images/' + element.Image.filename;
        }
    });
    return data;

}

async function getEventById(id) {
    return await eventRepository.getEventById(id);
}

async function deleteEventById(id) {
    return eventRepository.deleteEventById(id);
}

async function addEvent(body) {
    validateEvent(body);
    let event = {
        name: body.name,
        date: body.date,
        locationId: body.locationId,
        description: body.description,
        tags: body.tags
    }
    return await eventRepository.addEvent(event);
}

async function updateEvent(body, id) {
    return await eventRepository.updateEvent(body, id);
}

function validateEvent(body) {
    if (!body.name) {
        throw new ValidationError("Name is missing");
    }
    if (!body.date) {
        throw new ValidationError("Date is missing.");
    }
    if (!body.locationId) {
        throw new ValidationError("Location is missing");
    }
}

export { updateEvent, addEvent, getEventById, deleteEventById, getEvents };