/**
 * @description Middleware to authorize user based on allowed roles
 * @param {...string} roles - Allowed user roles (e.g., 'manager', 'admin')
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(user.role)) {
            return res
                .status(403)
                .json({ error: 'Access denied: insufficient role' });
        }

        next();
    };
};

module.exports = authorizeRoles;
