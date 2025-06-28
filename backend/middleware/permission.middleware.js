const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

/**
 * @description Middleware to check if manager owns the project
 */
const canAccessProject = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        const user = req.user;

        if (user.role !== 'manager') {
            logger.warn('Only managers can access projects', {
                userId: user.id,
                role: user.role,
                projectId,
            });
            return res
                .status(403)
                .json({ error: 'Access denied: role not allowed' });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            logger.warn('Project not found', {
                userId: user.id,
                projectId,
            });
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.ownerId !== user.id) {
            logger.warn('Manager tried to access foreign project', {
                userId: user.id,
                projectId,
                projectOwnerId: project.ownerId,
            });
            return res
                .status(403)
                .json({ error: 'Access denied: not your project' });
        }

        next();
    } catch (err) {
        logger.error('Error in canAccessProject middleware', {
            error: err,
            userId: req.user?.id,
        });
        next(err);
    }
};

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
    try {
        const taskId = Number(req.params.id);
        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const user = req.user;
        const allowedRoles = ['manager', 'developer'];

        if (!allowedRoles.includes(user.role)) {
            logger.warn('Unknown role access attempt', {
                userId: user.id,
                role: user.role,
            });
            return res.status(403).json({ error: 'Access denied' });
        }

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
    } catch (err) {
        logger.error('Error in canAccessTask middleware', {
            error: err,
            userId: req.user.id,
        });
        next(err);
    }
};

/**
 * @description Middleware to check if the user can create a task
 */
const canCreateTask = async (req, res, next) => {
    try {
        const projectId = Number(req.body.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid projectId' });
        }

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
    } catch (err) {
        logger.error('Error in canCreateTask middleware', {
            error: err,
            userId: req.user.id,
        });
        next(err);
    }
};

module.exports = {
    canCreateProject,
    canAccessTask,
    canCreateTask,
    canAccessProject,
};
