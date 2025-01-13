import express from 'express';
import log4js from 'log4js';
import asyncHandler from 'express-async-handler';
import * as locationService from '../services/location.service.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const log = log4js.getLogger("location route");
const locationRouter = express.Router();

// * @route GET /api/locations
// @desc    get locations
// @access  public
locationRouter.get('/', asyncHandler(async (req, res, next) => {
    log.info("GET");
    const locations = await locationService.getLocations();
    res.json(locations);
}));

// * @route GET /api/locations/:id
// @desc    get location by id
// @access  public
locationRouter.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    log.info(`GET ${id}`);

    const location = await locationService.getLocationById(id);
    if (location != null) {
        res.status(200).json({
            ...location
        });
    }
    const error = new NotFoundError(id);
    return res.status(400).json({ error: error.message });
}));

// * @route POST /api/locations
// @desc    add new locations
// @access  restricted
locationRouter.post('/', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");

    try {
        const newlocation = await locationService.addLocation(req.body);
        return res.status(201).json(newlocation);
    } catch (error) {
        if (error instanceof (ValidationError)) {
            return res.status(422).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}));


// * @route PUT /api/locations/:id
// @desc    update location by id
// @access  restricted
locationRouter.put('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    log.info(`PUT ${id}`);

    // * check valid id
    const isValid = await locationService.getLocationById(id);
    if (!isValid) {
        const error = new NotFoundError(id);
        return res.status(400).json({ error: error.message });

    }

    // * call update service
    await locationService.updateLocation(req.body, id);
    res.status(200).end();
}));

// * @route DELETE /api/locations/:id
// @desc    delete location by id
// @access  restricted
locationRouter.delete('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    log.info(`DELETE ${id}`);

    // * check valid id
    const isValid = await locationService.getLocationById(id);
    if (!isValid) {
        const error = new NotFoundError(id);
        return res.status(400).json({ error: error.message });
    }
    await locationService.deleteLocationById(id);
    res.status(204).end();
}));

export default locationRouter;
