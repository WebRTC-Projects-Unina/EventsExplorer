

import log4js from 'log4js';

const log = log4js.getLogger("middleware:errorHandler");
log.level = "error";

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

class NotFoundError extends Error {
    constructor(id) {
        super("Entity not found with id: " + id);
    }
}

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    log.warn(err);
    if (err.response) {
        if (err.response.data) {
            log.warn("axios error detail:", err.response.data);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: err.response.data.message || "Server Error",
            });
        }
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error",
    });
};

export { ErrorResponse, ValidationError, NotFoundError, errorHandler };