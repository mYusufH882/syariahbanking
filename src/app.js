const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const morganMiddleware = require('./shared/middlewares/logging.middleware');
const requestIdMiddleware = require('./shared/middlewares/request-id.middleware');
const errorHandler = require('./shared/middlewares/error.middleware');

const app = express();

app.use(requestIdMiddleware);
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Terjadi kesalahan pada server' });
});

app.use(errorHandler);

module.exports = app;