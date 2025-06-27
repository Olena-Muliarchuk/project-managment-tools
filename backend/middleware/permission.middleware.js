const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();

/**
 * @description Middleware to check if the user can create a project
 * @route Middleware
 * @access Only 'manager'
 * @returns {Function} Express middleware
 */
const canCreateProject = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res
            .status(403)
            .json({ error: 'Only managers can create projects' });
    }
    next();
};

/**
 * @description Middleware to check if the user can access a specific task
 * @route Middleware
 * @access
 * - 'manager': can access tasks in their own projects
 * - 'developer': can access only their own assigned tasks
 * @returns {Function} Express middleware
 */
const canAccessTask = async (req, res, next) => {
    const taskId = Number(req.params.id);
    const user = req.user;

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (user.role === 'manager') {
        if (task.project.ownerId !== user.id) {
            return res
                .status(403)
                .json({ error: 'Access denied: not your project' });
        }
        return next();
    }

    if (user.role === 'developer') {
        if (task.assignedToId !== user.id) {
            return res
                .status(403)
                .json({ error: 'Access denied: not your task' });
        }
        return next();
    }

    return res.status(403).json({ error: 'Access denied' });
};

/**
 * @description Middleware to check if the user can create a task
 * @route Middleware
 * @access
 * - 'manager': only in their own projects
 * - 'developer': denied
 * @returns {Function} Express middleware
 */
const canCreateTask = async (req, res, next) => {
    const { projectId } = req.body;
    const user = req.user;

    if (user.role === 'developer') {
        return res
            .status(403)
            .json({ error: 'Developers cannot create tasks' });
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (user.role === 'manager' && project.ownerId !== user.id) {
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
