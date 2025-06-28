const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();

/**
 * @description Create a new project
 * @param {Object} params
 * @param {string} params.title - Project title
 * @param {string} [params.description] - Optional description
 * @param {number} params.ownerId - User ID (owner of project)
 * @returns {Promise<Object>} Created project
 */
const createProject = async ({ title, description, ownerId }) => {
    if (!title) {
        const error = new Error('Title is required');
        error.statusCode = 400;
        throw error;
    }

    return await prisma.project.create({
        data: {
            title,
            description,
            owner: { connect: { id: ownerId } },
        },
    });
};

/**
 * @description Get all projects
 * @returns {Promise<Array>} List of all projects
 */
const getProjects = async () => {
    return await prisma.project.findMany({
        include: {
            owner: true,
            tasks: true,
        },
    });
};

/**
 * @description Get single project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Project data
 */
const getProject = async (id) => {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
        const error = new Error(`Project with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return project;
};

/**
 * @description Update a project by ID
 * @param {number} id - Project ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated project
 */
const updateProject = async (id, updateData) => {
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error(`Project with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return await prisma.project.update({
        where: { id },
        data: updateData,
    });
};

/**
 * @description Delete a project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Deleted project
 */
const deleteProject = async (id) => {
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
        const error = new Error(`Project with ID ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return await prisma.project.delete({ where: { id } });
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
