const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const createLogger = () => {
  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      
      // Add stack trace for errors
      if (stack) {
        log += `\n${stack}`;
      }
      
      // Add metadata if present
      if (Object.keys(meta).length > 0) {
        log += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
      }
      
      return log;
    })
  );

  // Create transports array
  const transports = [
    // Error log file - ONLY for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    }),
    
    // Combined log file - ALL levels
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat
    })
  ];

  // Add console transport for development
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
            let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
            
            if (stack) {
              log += `\n${stack}`;
            }
            
            if (Object.keys(meta).length > 0) {
              log += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
            }
            
            return log;
          })
        )
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports,
    // Handle uncaught exceptions
    exceptionHandlers: [
      new winston.transports.File({ 
        filename: path.join(logsDir, 'exceptions.log'),
        format: logFormat
      })
    ],
    // Handle unhandled promise rejections
    rejectionHandlers: [
      new winston.transports.File({ 
        filename: path.join(logsDir, 'rejections.log'),
        format: logFormat
      })
    ]
  });
};

module.exports = createLogger();