const logger = require('../utils/logger');

/**
 * @description Middleware to authorize user based on allowed roles
 * @param {...string} roles - Allowed user roles (e.g., 'manager', 'admin')
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            logger.warn('Authorization failed: Not authenticated', {
                method: req.method,
                url: req.originalUrl,
            });
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(user.role)) {
            logger.warn('Authorization failed: insufficient role', {
                userId: user.id,
                userRole: user.role,
                requiredRoles: roles,
                method: req.method,
                url: req.originalUrl,
            });
            return res
                .status(403)
                .json({ error: 'Access denied: insufficient role' });
        }

        next();
    };
};

module.exports = authorizeRoles;
