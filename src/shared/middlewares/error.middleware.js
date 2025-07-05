const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response.util');
const logger = require('../config/logger.config');

const errorHandler = (err, req, res, next) => {
  // IMPORTANT: Log dengan level 'error' agar masuk ke error.log
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
    userId: req.user?.userId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.error('Validation error', {
      validationErrors: err.errors,
      requestId: req.requestId,
      userId: req.user?.userId
    });
    
    return errorResponse(res, 'Validation error', 400, err.errors);
  }

  // Handle custom AppError
  if (err.isOperational) {
    logger.error('Application error', {
      error: err.message,
      statusCode: err.statusCode,
      requestId: req.requestId,
      userId: req.user?.userId
    });
    
    return errorResponse(res, err.message, err.statusCode);
  }

  // Handle unexpected errors
  logger.error('Unexpected error', {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
    userId: req.user?.userId
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return errorResponse(res, message, 500);
};

module.exports = errorHandler;