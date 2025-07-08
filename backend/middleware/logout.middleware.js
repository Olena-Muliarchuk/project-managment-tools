const prisma = require('../lib/prisma');

/**
 * @description Middleware to invalidate refresh token during logout
 * @route Middleware
 * @access Protected
 */
const logoutMiddleware = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        await prisma.refreshToken.delete({
            where: { token: refreshToken },
        });

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Failed to log out user', error: error });
    }
};

module.exports = logoutMiddleware;
