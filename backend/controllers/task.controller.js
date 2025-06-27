const taskService = require('../services/task.service');

/**
 * @description Create a new task
 * @route POST /api/tasks
 * @access Protected
 * @returns {void}
 */
exports.createTask = async (req, res) => {
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
        console.error('[Create Task]', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @description Get all tasks
 * @route GET /api/tasks
 * @access Protected
 * @returns {void}
 */
exports.getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('[Get Tasks]', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @description Get a task by ID
 * @route GET /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(Number(id));
        res.status(200).json(task);
    } catch (error) {
        console.error('[Get Task]', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @description Update a task by ID
 * @route PUT /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedTask = await taskService.updateTask(
            Number(id),
            updateData
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('[Update Task]', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @description Delete a task by ID
 * @route DELETE /api/tasks/:id
 * @access Protected
 * @returns {void}
 */
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await taskService.deleteTask(Number(id));
        res.status(200).json({ success: true, deleted });
    } catch (error) {
        console.error('[Delete Task]', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
