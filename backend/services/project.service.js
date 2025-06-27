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
        throw new Error('Title is required');
    }

    const newProject = await prisma.project.create({
        data: {
            title,
            description,
            owner: {
                connect: { id: ownerId },
            },
        },
    });

    return newProject;
};

/**
 * @description Get all projects
 * @returns {Promise<Array>} List of all projects
 */
const getProjects = async () => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                owner: true, // додати дані про власника, якщо потрібно
                tasks: true, // додати пов'язані задачі, якщо треба
            },
        });
        return projects;
    } catch (error) {
        throw new Error('Error fetching projects');
    }
};

/**
 * @description Get single project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Project data or null
 */
const getProject = async (id) => {
    try {
        const project = await prisma.project.findUnique({ where: { id } });
        return project;
    } catch (error) {
        console.error('[Get Project by ID]', error);
        throw new Error(`Error retrieving project with ID ${id}`)
    }
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
        throw new Error(`Project with ID ${id} not found`);
    }

    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: updateData,
        });
        return updatedProject;
    } catch (error) {
        console.error('[Update Project]', error);
        throw new Error(`Error updating project with ID ${id}`);
    }
};

/**
 * @description Delete a project by ID, after checking it exists
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Deleted project
 */
const deleteProject = async (id) => {
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
        throw new Error(`Project with ID ${id} not found`);
    }

    try {
        const deletedProject = await prisma.project.delete({ where: { id } });
        return deletedProject;
    } catch (error) {
        console.error('[Delete Project]', error);
        throw new Error(
            error.message || `Error deleting project with ID ${id}`
        );
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
