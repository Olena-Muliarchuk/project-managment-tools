const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

/**
 * @description Register new user
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @param {string} [role='user'] - User role ("user", "manager", "developer")
 * @returns {Promise<Object>} Created user data
 * @throws {Error} If user already exists
 */
const register = async (email, password, role = 'user') => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const err = new Error('User already exists');
            err.statusCode = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        return { id: user.id, email: user.email, role: user.role };
    } catch (err) {
        if (!err.statusCode) { err.statusCode = 500; }
        throw err;
    }
};

/**
 * @description Generate access token
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
};

/**
 * @description Generate refresh token and store in DB
 * @param {number} userId - User ID
 * @returns {Promise<string>} Refresh token
 */
const generateRefreshToken = async (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });

    return token;
};

/**
 * @description Authenticate user and return tokens
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @returns {Promise<Object>} Auth response with token and user info
 * @throws {Error} If credentials are invalid
 */
const login = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const err = new Error('Invalid email or password');
            err.statusCode = 401; // Unauthorized
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            throw err;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role },
        };
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        throw err;
    }
};

/**
 * @description Refresh JWT tokens
 * @param {string} refreshToken - Refresh token from client
 * @returns {Promise<Object>} New access and refresh tokens
 * @throws {Error} If refresh token is invalid or expired
 */
const refresh = async (refreshToken) => {
    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const stored = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!stored || stored.expiresAt < new Date()) {
            const err = new Error('Refresh token expired or invalid');
            err.statusCode = 403;
            throw err;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        await prisma.refreshToken.delete({ where: { token: refreshToken } });

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user.id);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: { id: user.id, email: user.email, role: user.role },
        };
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 403;
        }
        throw err;
    }
};

/**
 * @description Logout user by deleting refresh token
 * @param {string} refreshToken - Token to delete
 * @returns {Promise<void>}
 */
const logout = async (refreshToken) => {
    try {
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
};
