const prisma = require('../lib/prisma');

/**
 * @description Get user by ID (profile view)
 * @param {number} id - User ID
 * @returns {Promise<Object>}
 * @throws {Error} If not found or invalid ID
 */
const getUserById = async (id) => {
    const userId = Number(id);
    if (isNaN(userId)) {
        const error = new Error('Invalid user ID');
        error.statusCode = 400;
        throw error;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        const error = new Error(`User with ID ${userId} not found`);
        error.statusCode = 404;
        throw error;
    }

    return user;
};

/**
 * @description Update user by ID
 * @param {number} id - User ID
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>}
 * @throws {Error} If user not found or invalid data
 */
const updateUser = async (id, data) => {
    const userId = Number(id);
    if (isNaN(userId)) {
        const error = new Error('Invalid user ID');
        error.statusCode = 400;
        throw error;
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
        const error = new Error(`User with ID ${userId} not found`);
        error.statusCode = 404;
        throw error;
    }

    const allowed = ['email', 'password']; // explicitly allowed fields
    const payload = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowed.includes(key))
    );

    return prisma.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
};

/**
 * @description Get list of all users
 * @returns {Promise<Array<Object>>}
 */
const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
};

module.exports = {
    getUserById,
    updateUser,
    getAllUsers,
};
