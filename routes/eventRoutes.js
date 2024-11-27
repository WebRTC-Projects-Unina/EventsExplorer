import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import log4js from 'log4js';
import * as eventService from '../services/event.service.js';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import { ErrorResponse, ValidationError } from '../middleware/errorHandler.js';
const log = log4js.getLogger("event route");
const eventRouter = express.Router();

// * @route GET /api/events
// @desc    get events
// @access  public
eventRouter.get('/', asyncHandler(async (req, res, next) => {
    log.info("GET");
    const events = await eventService.getEvents();
    res.json(events);
}));

// * @route GET /api/events/:id
// @desc    get event by id
// @access  public
eventRouter.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    log.info(`GET ${id}`);

    const event = await eventService.getEventById(id);
    if (event != null) {
        res.status(200).json({
            ...event
        });
    }
    else {
        res.status(404).end();
    }

}));

// * @route POST /api/events
// @desc    add new events
// @access  restricted
eventRouter.post('/', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");
    try {
        const newEvent = await eventService.addEvent(req.body);
        return res.status(201).json(newEvent);

    } catch (error) {
        if (error instanceof (ValidationError)) {
            // return next(error.message, 422);
            return res.status(422).json({ error: error.message });

        }
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}));

// * @route PUT /api/events/:id
// @desc    update event by id
// @access  restricted
eventRouter.put('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {

    const { id } = req.params;
    log.info(`PUT ${id}`);

    // * check valid id
    const isValid = await eventService.getEventById(id);
    if (!isValid) {
        return next(new ErrorResponse("invalid id", 400));
    }

    // * call update service
    await eventService.updateEvent(req.body, id);
    res.status(200);
}));

// * @route DELETE /api/events/:id
// @desc    delete event by id
// @access  restricted
eventRouter.delete('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    log.info(`DELETE ${id}`);

    // * check valid id
    const isValid = await eventService.getEventById(id);
    if (!isValid) {
        return next(new ErrorResponse("invalid id", 400));
    }
    await eventService.deleteEventById(id);
    res.status(204).end();
}));
export default eventRouter;