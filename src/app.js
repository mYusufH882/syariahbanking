const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const morganMiddleware = require('./shared/middlewares/logging.middleware');
const requestIdMiddleware = require('./shared/middlewares/request-id.middleware');
const errorHandler = require('./shared/middlewares/error.middleware');
const logger = require('./shared/config/logger.config');
require('dotenv').config();

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const app = express();

// Log application startup
logger.info('Application starting up', {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  timestamp: new Date().toISOString()
});

app.use(requestIdMiddleware);
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    logger.warn('404 - Endpoint not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId: req.requestId
    });

    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  // Enhanced logging instead of console.error
  logger.error('Unhandled Error', {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId || 'no-request-id',
    userId: req.user?.userId || 'anonymous',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body ? JSON.stringify(req.body) : null,
    query: req.query ? JSON.stringify(req.query) : null,
    timestamp: new Date().toISOString()
  });

  // Send response with requestId for tracking
  res.status(err.statusCode || 500).json({ 
    message: err.message || 'Terjadi kesalahan pada server',
    requestId: req.requestId || 'no-request-id',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use(errorHandler);

module.exports = app;