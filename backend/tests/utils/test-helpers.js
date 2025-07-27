const request = require('supertest');
const app = require('../../app');
const prisma = require('../../lib/prisma');

/**
 * Clears the database before or after tests.
 */
const clearDatabase = async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
};

/**
 * Registers a user and logs them in.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} role - User role (e.g. 'manager', 'developer', etc.).
 * @returns {Promise<string>} The access token for the authenticated user.
 */
const createUserAndLogin = async (email, password, role = 'developer') => {
    await request(app)
        .post('/api/auth/register')
        .send({ email, password, role });

    const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

    return res.body.accessToken;
};

module.exports = {
    clearDatabase,
    createUserAndLogin,
};
