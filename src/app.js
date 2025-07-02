const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./shared/middlewares/error.middleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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