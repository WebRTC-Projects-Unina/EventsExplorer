import express from 'express';
import log4js from 'log4js';
import { validationResult } from 'express-validator';
import { ErrorResponse, ValidationError } from '../middleware/errorHandler.js';
const log = log4js.getLogger("request validator");

function validate(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let msg = errors.array({ onlyFirstError: true })[0].msg;
        log.error(msg);
        return next(
            new ErrorResponse(msg, 400)
        );
    }
    next();
}

export { validate };