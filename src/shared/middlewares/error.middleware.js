const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response.util');

const errorHandler = (err, req, res, next) => { 
    console.log('Error caught by middleware: ', err);
    
    if (err instanceof ZodError) {
        return errorResponse(res, 'Validation error', 400, err.errors);
    }

    console.error('Unexpected error:', err);
    return errorResponse(res, 'Internal server error', 500);
};

module.exports = errorHandler;