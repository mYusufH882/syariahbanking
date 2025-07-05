const { uuidv4 } = require("zod/v4");

const requestIdMiddleware = (req, res, next) => { 
    req.requestId = uuidv4();
    res.setHeader('X-Request-ID', req.requestId);
    next();
};

module.exports = requestIdMiddleware;