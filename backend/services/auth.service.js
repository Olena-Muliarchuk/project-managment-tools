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
 * @description Authenticate user and return JWT
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

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    } catch (err) {
        if (!err.statusCode) { err.statusCode = 500; }
        throw err;
    }
};

module.exports = { register, login };
