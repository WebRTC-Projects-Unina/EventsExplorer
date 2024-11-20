import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import log4js from 'log4js';
import * as eventService from '../services/event.service.js';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }
    const event = await eventService.getEventById(id);
    res.status(200).json({
        ...event
    });
}));

// * @route POST /api/events
// @desc    add new events
// @access  restricted
eventRouter.post('/', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");

    const { name, date, locationId, description, tags } = req.body;

    //todo move validator in own file
    if (!name || !date || !locationId) {
        return res.status(400).json({ error: 'Name, date, and locationId are required' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }
    const newEvent = await eventService.addEvent(req.body);
    res.status(201).json(newEvent);
}));

// * @route PUT /api/events/:id
// @desc    update event by id
// @access  restricted
eventRouter.put('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {
    log.info(`PUT ${id}`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }

    // * check valid id
    const isValid = await eventService.getEventById(id);
    if (!isValid) {
        return next(new ErrorResponse("invalid id", 400));
    }
    await eventService.deleteEventById(id);
    res.status(204).end();
}));
export default eventRouter;