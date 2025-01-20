import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import { Op } from 'sequelize';
import log4js from 'log4js';

const log = log4js.getLogger("event repository");
const Tag = db.Tag;
const Event = db.Event;
const Event_Tags = db.Event_Tags;

async function getEvents(body) {
    let text = body.text ?? '';
    const search = {
        where: {
            [Op.and]: []
        }, include: [db.Location, db.Tag, db.Image]
    };
    if (body.locationId != undefined) {
        search.where[Op.and].push({ locationId: body.locationId });
    }
    if (body.text != undefined) {
        search.where[Op.and].push({
            [Op.or]: {
                name: { [Op.like]: '%' + text + '%' },
                description: { [Op.like]: '%' + text + '%' }
            }
        });
    }
    if (body.date != undefined) {
        search.where[Op.and].push({ date: { [Op.gte]: new Date(body.date) } });
    }
    const data = await Event.findAll(search);
    return data;
}

async function getEventById(id) {
    const data = await Event.findOne({
        where: {
            id: id
        },
        include: [{
            model: db.Location, attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        {
            model: db.Tag, attributes: ['id', 'name'], through: {
                attributes: []
            }
        },
        { model: db.Image, attributes: ['filename'] }]
    });

    return data;
}

async function addEvent(body) {

    return await Event.create(body).then((event) => {
        if (body.tags != undefined) {
            body.tags.forEach(tag => {
                if (tag.id == undefined) {
                    Tag.create(tag).then(async (tag) => {
                        await tag.addEvent(event);
                    });
                }
            });
        }
        return event;
    });
}

async function updateEvent(body, id) {
    return await Event.update(body, {
        where: {
            id: id
        },
        include: [db.Location, db.Tag]
    }).then(async (updatedEvent) => {
        //Get the current tags
        let event_tags = await Event_Tags.findAll({
            where: {
                EventId: id
            }
        });

        let currentIds = event_tags == null ? new Array() : event_tags?.map(o => o.TagId);
        let currentIdsSet = new Set(currentIds);
        let newIds = body.tags == null ? new Array() : body.tags.map(o => o.id);
        let newIdsSet = new Set(newIds);

        let toRemove = currentIds.filter(x => !newIdsSet.has(x));
        let add = newIds.filter(x => !currentIdsSet.has(x));

        // let difference = currentIds.filter(x => !toRemove.has(x));
        await Event_Tags.destroy({
            where: {
                [Op.and]: {
                    EventId: id,
                    TagId: toRemove
                }
            }
        });
        add.forEach(async o => {
            if (o != undefined) {
                await Event_Tags.create({
                    EventId: id,
                    TagId: o
                });
            }
        });

        //add new tags
        if (body.tags != null) {
            body.tags.forEach(tag => {
                if (tag.id == undefined) {
                    Tag.create(tag).then(async (createdTag) => {
                        Event_Tags.create({
                            EventId: id,
                            TagId: createdTag.id
                        });
                    });
                }
            });
        }

        return updatedEvent;
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