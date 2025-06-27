const { createLogger, format, transports } = require('winston');

/**
 * @description Winston logger configuration
 * Uses timestamped console output with optional metadata
 * Log level depends on NODE_ENV ('debug' for development, 'info' otherwise)
 * @module utils/logger
 */
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, ...meta }) =>
    `[${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`
  )
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    // Optional file outputs:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false,
});

module.exports = logger;
