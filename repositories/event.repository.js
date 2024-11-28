import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import { Op } from 'sequelize';
import log4js from 'log4js';
const log = log4js.getLogger("event repository");

const Event = db.Event;

async function getEvents(body) {
    let text = body.text ?? '';
    const search = {
        where: {
            [Op.and]: [
                {
                    date: {
                        [Op.gte]: new Date()
                    },
                    [Op.or]: {
                        name: { [Op.like]: '%' + text + '%' },
                        description: { [Op.like]: '%' + text + '%' }
                    }
                }]

        },
    };
    if (body.locationId != undefined) {
        search.where[Op.and].push({ locationId: body.locationId });
    }
    const data = await Event.findAll(search);
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