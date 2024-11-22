// locationRoutes.js
import express from 'express';
import log4js from 'log4js';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import * as locationService from '../services/location.service.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }
    const location = await locationService.getLocationById(id);
    res.status(200).json({
        ...location
    });
}));

// * @route POST /api/locations
// @desc    add new locations
// @access  restricted
locationRouter.post('/', authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");
    //todo move validator in own file
    const { name, latitude, longitude, website } = req.body;
    if (!name || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }
    const newlocation = await locationService.addLocation(req.body);
    res.status(201).json(newlocation);
}));


// * @route PUT /api/locations/:id
// @desc    update location by id
// @access  restricted
locationRouter.put('/:id', authenticateToken, authorizeAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    log.info(`PUT ${id}`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }

    // * check valid id
    const isValid = await locationService.getLocationById(id);
    if (!isValid) {
        return next(new ErrorResponse("invalid id", 400));
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ErrorResponse(errors.array({ onlyFirstError: true })[0].msg, 400)
        );
    }

    // * check valid id
    const isValid = await locationService.getLocationById(id);
    if (!isValid) {
        return next(new ErrorResponse("invalid id", 400));
    }
    await locationService.deleteLocationById(id);
    res.status(204).end();
}));

export default locationRouter;
