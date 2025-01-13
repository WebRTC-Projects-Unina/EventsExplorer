import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import log4js from 'log4js';
import * as subscriberService from '../services/subscriber.service.js';
import asyncHandler from 'express-async-handler';
const log = log4js.getLogger("image route");
const subscribeRouter = express.Router();

subscribeRouter.post("/", asyncHandler(async (req, res, next) => {
    log.info("POST");
    await subscriberService.createSubscribers(req, res, next);
    //await imageService.uploadSingleImage(req, res);
    //res.json("Successfully subscribed to newsletter! :)");
}));

export default subscribeRouter;
