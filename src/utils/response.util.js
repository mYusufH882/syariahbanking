const successResponse = (res, data, statusCode = 200) => { 
    return res.status(statusCode).json({
        success: true,
        ...data
    });
};

const errorResponse = (res, message, statusCode = 500, errors = null) => { 
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors })
    });
};

module.exports = {
    successResponse,
    errorResponse
};