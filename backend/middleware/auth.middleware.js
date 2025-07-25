const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * @description Middleware to authenticate users using JWT
 * Checks for a valid token in the Authorization header,
 * attaches user info to request object if valid
 * @route Middleware
 * @access Protected
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.warn('Authorization token missing', {
            method: req.method,
            url: req.originalUrl,
        });
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;

        logger.info('Authorization successful', {
            userId: decoded.id,
            method: req.method,
            url: req.originalUrl,
        });

        next();
    } catch (error) {
        logger.error('Invalid or expired token', {
            method: req.method,
            url: req.originalUrl,
            error: error.message,
        });
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
