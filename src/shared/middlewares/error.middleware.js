const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response.util');
const logger = require('../config/logger.config');

const errorHandler = (err, req, res, next) => { 
    // console.log('Error caught by middleware: ', err);
    logger.error('Error occured', {
        error: err.message,
        stack: err.stack,
        requestId: req.requestId,
        userId: req.user?.userId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    if (err instanceof ZodError) {
        return errorResponse(res, 'Validation error', 400, err.errors);
    }

    const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

    // console.error('Unexpected error:', err);
    return errorResponse(res, message, err.statusCode || 500);
};

module.exports = errorHandler;