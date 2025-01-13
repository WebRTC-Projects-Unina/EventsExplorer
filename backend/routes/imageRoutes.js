import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/authorization.js';
import log4js from 'log4js';
import * as imageService from '../services/image.service.js';
import asyncHandler from 'express-async-handler';
const log = log4js.getLogger("image route");
const imageRouter = express.Router();

imageRouter.post("/upload/upload-single", imageService.upload.single('file'), authenticateToken, authorizeAdmin, asyncHandler(async (req, res, next) => {
    log.info("POST");
    await imageService.uploadSingleImage(req, res, next);
    res.json();
}));

export default imageRouter;
