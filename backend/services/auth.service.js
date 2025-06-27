const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Importing Prisma Client from a custom output path as defined in schema.prisma:
// generator client {
//   provider = "prisma-client-js"
//   output   = "./prisma/generated/prisma"
// }
// For more details, see:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();

/**
 * @description Register new user
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @param {string} [role='user'] - User role ("user", "manager", "developer")
 * @returns {Promise<Object>} Created user data
 * @throws {Error} If user already exists
 */
const register = async (email, password, role = 'user') => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
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
};

/**
 * @description Authenticate user and return JWT
 * @param {string} email - User email
 * @param {string} password - Plaintext password
 * @returns {Promise<Object>} Auth response with token and user info
 * @throws {Error} If credentials are invalid
 */
const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { throw new Error('Invalid email or password'); }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { throw new Error('Invalid email or password'); }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
};

module.exports = { register, login };
