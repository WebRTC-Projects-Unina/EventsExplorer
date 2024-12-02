import log4js from 'log4js';
import * as tagRepository from '../repositories/tag.repository.js';
import { ValidationError } from '../middleware/errorHandler.js';

const log = log4js.getLogger("service:tag");
log.level = "debug";

async function getTags(body) {
    const data = tagRepository.getTags(body);
    return data;
}

async function addTag(body) {
    validateTag(body);
    return await tagRepository.addTag(body);
}

async function deleteTagById(id) {
    return tagRepository.deleteTagById(id);
}

function validateTag(body) {
    if (!body.name) {
        throw new ValidationError("Name is missing");
    }
}

export { getTags, addTag, deleteTagById };