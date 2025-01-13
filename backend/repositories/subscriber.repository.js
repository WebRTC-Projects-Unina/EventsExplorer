import { NotFoundError } from "../middleware/errorHandler.js";
import db from "../models/index.js";
import log4js from 'log4js';
const log = log4js.getLogger("Subscriber repository");
const Subscriber = db.Subscriber;

async function getSubscribers() {
    const data = await Subscriber.findAll();
    return data;
}
async function getSubscriberPerMail(mail) {
    const data = await Subscriber.findOne({ mail });
    return data;
}

async function addSubscriber(body) {
    return await Subscriber.create(body);
}
async function deleteSubscriberById(id) {
    return await Subscriber.destroy({
        where: {
            id: id
        }
    }).then((rowsDeleted) => {
        log.info("rows deleted: " + rowsDeleted);
    }).catch((error) => {
        throw new NotFoundError(error);
    });
}
export { getSubscribers, addSubscriber, deleteSubscriberById, getSubscriberPerMail };