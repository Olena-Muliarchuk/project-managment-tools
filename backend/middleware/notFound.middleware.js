const logger = require('../utils/logger');

const notFoundHandler = (req, res, _next) => {
    const message = `Route ${req.originalUrl} not found`;

    logger.warn(message, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    res.status(404).json({
        success: false,
        message,
    });
};

module.exports = notFoundHandler;
