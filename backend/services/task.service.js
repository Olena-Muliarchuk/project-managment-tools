const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();

/**
 * @description Create a new task
 * @param {Object} taskData - Task creation data
 * @returns {Promise<Object>}
 * @throws {Error} If related entities not found
 */
const createTask = async ({
    title,
    description,
    projectId,
    assignedToId,
    createdById,
}) => {
    const projectIdInt = Number(projectId);
    if (isNaN(projectIdInt)) {
        const error = new Error('Invalid projectId');
        error.statusCode = 400;
        throw error;
    }
    const project = await prisma.project.findUnique({
        where: { id: projectIdInt },
    });
    if (!project) {
        const error = new Error(`Project with ID ${projectIdInt} not found`);
        error.statusCode = 404;
        throw error;
    }

    const assignedToIdInt = Number(assignedToId);
    if (isNaN(assignedToIdInt)) {
        const error = new Error('Invalid assignedToId');
        error.statusCode = 400;
        throw error;
    }
    if (assignedToIdInt) {
        const user = await prisma.user.findUnique({
            where: { id: assignedToIdInt },
        });
        if (!user) {
            const error = new Error(`User with ID ${assignedToIdInt} not found`);
            error.statusCode = 404;
            throw error;
        }
    }

    return await prisma.task.create({
        data: {
            title,
            description,
            project: { connect: { id: projectIdInt } },
            createdBy: { connect: { id: Number(createdById) } },
            ...(assignedToIdInt && {
                assignedTo: { connect: { id: assignedToIdInt } },
            }),
        },
    });
};

/**
 * @description Get all tasks
 * @returns {Promise<Array>}
 */
const getTasks = async () => {
    return prisma.task.findMany({
        include: {
            project: true,
            assignedTo: true,
            createdBy: true,
        },
    });
};

/**
 * @description Get task by ID
 * @param {number} id
 * @returns {Promise<Object>}
 * @throws {Error} If not found
 */
const getTaskById = async (id) => {
    const task = await prisma.task.findUnique({
        where: { id },
        include: {
            project: true,
            assignedTo: true,
            createdBy: true,
        },
    });

    if (!task) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return task;
};

/**
 * @description Update task by ID
 * @param {number} id
 * @param {Object} updateData
 * @returns {Promise<Object>}
 * @throws {Error} If not found or invalid assigned user
 */
const updateTask = async (id, updateData) => {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    if (updateData.assignedToId) {
        const user = await prisma.user.findUnique({
            where: { id: Number(updateData.assignedToId) },
        });
        if (!user) {
            const error = new Error(
                `User with ID ${updateData.assignedToId} not found`
            );
            error.statusCode = 404;
            throw error;
        }
    }

    return await prisma.task.update({
        where: { id },
        data: updateData,
    });
};

/**
 * @description Delete task by ID
 * @param {number} id
 * @returns {Promise<Object>}
 * @throws {Error} If not found
 */
const deleteTask = async (id) => {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return prisma.task.delete({ where: { id } });
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
