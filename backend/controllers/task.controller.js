const taskService = require('../services/task.service');

/**
 * @description Create a new task
 * @route POST /api/tasks
 * @access Protected
 * @returns {void}
 */
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, projectId, assignedToId } = req.body;
        const createdById = Number(req.user.id);

        const task = await taskService.createTask({
            title,
            description,
            projectId,
            assignedToId,
            createdById,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get all tasks
 * @route GET /api/tasks
 * @access Protected
 * @returns {void}
 */
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get a task by ID
 * @route GET /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.getTaskById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(Number(id));
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update a task by ID
 * @route PUT /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.updateTask = async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedTask = await taskService.updateTask(
            Number(id),
            updateData
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a task by ID
 * @route DELETE /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.deleteTask = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deleted = await taskService.deleteTask(Number(id));
        res.status(200).json({ success: true, deleted });
    } catch (error) {
        next(error);
    }
};
