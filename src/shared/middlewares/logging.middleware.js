const morgan = require('morgan');
const logger = require('../config/logger.config');

// Custom Morgan tokens
morgan.token('user-id', (req) => req.user?.userId || 'anonymous');
morgan.token('request-id', (req) => req.requestId || 'no-id');

// Create custom format
const morganFormat = ':method :url :status :response-time ms - :res[content-length] | User: :user-id | ReqID: :request-id';

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const trimmedMessage = message.trim();
      
      // Parse status code from message
      const statusMatch = trimmedMessage.match(/(\d{3})/);
      const statusCode = statusMatch ? parseInt(statusMatch[1]) : 200;
      
      // Log with appropriate level based on status code
      if (statusCode >= 400) {
        logger.error(`HTTP ${trimmedMessage}`);
      } else if (statusCode >= 300) {
        logger.warn(`HTTP ${trimmedMessage}`);
      } else {
        logger.info(`HTTP ${trimmedMessage}`);
      }
    }
  }
});

module.exports = morganMiddleware;