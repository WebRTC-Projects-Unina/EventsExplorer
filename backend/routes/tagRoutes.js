import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import log4js from 'log4js';
import * as tagservice from '../services/tag.service.js';
import asyncHandler from 'express-async-handler';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
const log = log4js.getLogger("tag route");
const tagRouter = express.Router();

// * @route GET /api/tags
// @desc    get tags
// @access  public
tagRouter.get('/', asyncHandler(async (req, res, next) => {
    log.info("GET");
    const tags = await tagservice.getTags(req.body);
    res.json(tags);
}));


// * @route POST /api/tags
// @desc    add new tags
// @access  restricted
tagRouter.post('/', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");
    try {
        const newTag = await tagservice.addTag(req.body);
        return res.status(201).json(newTag);

    } catch (error) {
        console.log(error);
        if (error instanceof (ValidationError)) {
            return res.status(422).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}));

// * @route DELETE /api/tags/:id
// @desc    delete tag by id
// @access  restricted
tagRouter.delete('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    log.info(`DELETE ${id}`);

    await tagservice.deleteTagById(id);
    res.status(204).end();
}));
export default tagRouter;