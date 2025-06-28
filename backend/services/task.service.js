const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();

/**
 * @description Create a new task with validation
 * @param {Object} taskData - Task creation data
 * @returns {Promise<Object>}
 * @throws {Error} If required fields are missing or entities not found
 */
const createTask = async ({
    title,
    description,
    projectId,
    assignedToId,
    createdById,
}) => {
    const missingFields = [];
    if (!title) { missingFields.push('title'); }
    if (!projectId) { missingFields.push('projectId'); }
    if (!createdById) { missingFields.push('createdById'); }
    if (missingFields.length > 0) {
        const error = new Error(
            `Missing required fields: ${missingFields.join(', ')}`
        );
        error.statusCode = 400;
        throw error;
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        const error = new Error(`Project with ID ${projectId} not found`);
        error.statusCode = 404;
        throw error;
    }

    if (assignedToId) {
        const user = await prisma.user.findUnique({
            where: { id: assignedToId },
        });
        if (!user) {
            const error = new Error(`User with ID ${assignedToId} not found`);
            error.statusCode = 404;
            throw error;
        }
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            project: { connect: { id: projectId } },
            createdBy: { connect: { id: createdById } },
            ...(assignedToId && {
                assignedTo: { connect: { id: assignedToId } },
            }),
        },
    });

    return task;
};

/**
 * @description Get all tasks with related entities
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
 * @description Get a task by its ID
 * @param {number} id - Task ID
 * @returns {Promise<Object>}
 * @throws {Error} If task not found
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
 * @description Update an existing task by ID
 * @param {number} id - Task ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>}
 * @throws {Error} If task not found
 */
const updateTask = async (id, updateData) => {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
        const error = new Error(`Task with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    const updatedTask = await prisma.task.update({
        where: { id },
        data: updateData,
    });

    return updatedTask;
};

/**
 * @description Delete a task by its ID
 * @param {number} id - Task ID
 * @returns {Promise<Object>}
 * @throws {Error} If task not found
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
