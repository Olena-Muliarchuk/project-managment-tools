const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

/**
 * @description Middleware to check if the user can create a project
 */
const canCreateProject = (req, res, next) => {
    if (req.user.role !== 'manager') {
        logger.warn('Access denied: only managers can create projects', {
            userId: req.user.id,
            role: req.user.role,
            url: req.originalUrl,
        });
        return res
            .status(403)
            .json({ error: 'Only managers can create projects' });
    }
    next();
};

/**
 * @description Middleware to check if the user can access a specific task
* @access
 * - 'manager': can access tasks in their own projects
 * - 'developer': can access only their own assigned tasks
*/
const canAccessTask = async (req, res, next) => {
    const taskId = Number(req.params.id);
    const user = req.user;

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });

    if (!task) {
        logger.warn('Task not found', { taskId, userId: user.id });
        return res.status(404).json({ error: 'Task not found' });
    }

    if (user.role === 'manager') {
        if (task.project.ownerId !== user.id) {
            logger.warn('Manager access denied: not their project', {
                userId: user.id,
                taskId,
                projectOwnerId: task.project.ownerId,
            });
            return res
                .status(403)
                .json({ error: 'Access denied: not your project' });
        }
        return next();
    }

    if (user.role === 'developer') {
        if (task.assignedToId !== user.id) {
            logger.warn('Developer access denied: not their task', {
                userId: user.id,
                taskId,
                assignedToId: task.assignedToId,
            });
            return res
                .status(403)
                .json({ error: 'Access denied: not your task' });
        }
        return next();
    }

    logger.warn('Unknown role access attempt', {
        userId: user.id,
        role: user.role,
    });
    return res.status(403).json({ error: 'Access denied' });
};

/**
 * @description Middleware to check if the user can create a task
 */
const canCreateTask = async (req, res, next) => {
    const { projectId } = req.body;
    const user = req.user;

    if (user.role === 'developer') {
        logger.warn('Developer tried to create a task', {
            userId: user.id,
            projectId,
        });
        return res
            .status(403)
            .json({ error: 'Developers cannot create tasks' });
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        logger.warn('Project not found while creating task', {
            userId: user.id,
            projectId,
        });
        return res.status(404).json({ error: 'Project not found' });
    }

    if (user.role === 'manager' && project.ownerId !== user.id) {
        logger.warn('Manager tried to create task in foreign project', {
            userId: user.id,
            projectId,
            projectOwnerId: project.ownerId,
        });
        return res
            .status(403)
            .json({ error: 'Access denied: not your project' });
    }

    next();
};

module.exports = {
    canCreateProject,
    canAccessTask,
    canCreateTask,
};
