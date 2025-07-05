const morgan = require('morgan');
const logger = require('../config/logger.config');

morgan.token('user-id', (req) => req.user?.userId || 'anonymous');
morgan.token('request-id', (req) => req.requestId || 'no-id');

const morganMiddleware = morgan(
    ':method :url :status :response-time ms - :res[content-length] | User: :user-id | reqID: :request-id',
    {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }
);

module.exports = morganMiddleware;