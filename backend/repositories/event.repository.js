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
    let tagFilter = undefined;
    if (body.tag != undefined && !isNaN(Number(body.tag))) {
        tagFilter = { id: Number(body.tag) };
    }

    const search = {
        where: {
            [Op.and]: []
        }, include: [db.Location, db.Image, {
            model: db.Tag, attributes: ['id', 'name'],
            where: tagFilter,
            through: {
                attributes: [],
            }
        },]
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
                        await Event_Tags.create({
                            EventId: event.id,
                            TagId: tag.id
                        });
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
        const event_tags = await Event_Tags.findAll({
            where: {
                EventId: id
            }
        });

        const currentTagIds = event_tags?.map(o => o.TagId) || [];
        const currentIdsSet = new Set(currentTagIds);

        const newTagIds = body.Tags?.map(o => o.id) || [];
        const newIdsSet = new Set(newTagIds);

        const tagIdsToRemove = currentTagIds.filter(id => !newIdsSet.has(id));
        const tagsToAdd = body.Tags.filter(tag => !currentIdsSet.has(tag.id));

        await Event_Tags.destroy({
            where: {
                [Op.and]: {
                    EventId: id,
                    TagId: tagIdsToRemove
                }
            }
        });
        tagsToAdd.forEach(async o => {
            if (o.id == undefined || o.id == 0 || o.id == '') {

                let tag = await Tag.findOne({
                    where: {
                        name: o.name
                    }
                });
                if (!tag) {
                    tag = await Tag.create({ "name": o.name })
                }
                await Event_Tags.create({
                    EventId: id,
                    TagId: tag.id
                });
            }
            else {
                await Event_Tags.create({
                    EventId: id,
                    TagId: o.id
                });
            }
        });
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