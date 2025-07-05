const winston = require('winston');
const path = require('path');

const createLogger = () => {
    const formats = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    );

    const transports = [
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxSize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxSize: 5242880,
            maxFiles: 5,
        })
    ];

    if (process.env.NODE_ENV === 'development') {
        transports.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        );
    }

    return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: formats,
        transports
    });
};

module.exports = createLogger();