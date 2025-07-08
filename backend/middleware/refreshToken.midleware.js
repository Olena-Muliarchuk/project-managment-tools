const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

/**
 * @description Middleware to verify the validity of the refresh token
 * @route Middleware
 * @access Protected
 */
const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        // Check if the refresh token exists in the database
        const existingToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!existingToken) {
            return res
                .status(401)
                .json({ message: 'Invalid or expired refresh token' });
        }

        // Verify if the token is valid
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        req.user = decoded;

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: 'Invalid refresh token', error: error });
    }
};

module.exports = verifyRefreshToken;
