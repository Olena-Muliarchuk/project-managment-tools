/**
 * @description Tasks routes module
 * @module routes/task
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
    canAccessTask,
    canCreateTask,
} = require('../middleware/permission.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require('../controllers/task.controller');
const {
    validateTaskCreation,
    validateTaskUpdate,
} = require('../validators/task.validator');
const { validateIdParam } = require('../validators/common.validator');

// Apply authentication to all task routes
router.use(auth);

/**
 * @route GET /api/tasks
 * @description Get all tasks
 * @access Protected
 */
router.get('/', getTasks);

/**
 * @route GET /api/tasks/:id
 * @description Get a task by ID
 * @access Protected
 */
router.get('/:id', validateIdParam, canAccessTask, getTaskById);
/**
 * @route POST /api/tasks
 * @description Create a new task
 * @access Protected
 */
router.post('/', authorizeRoles('manager'), validateTaskCreation, canCreateTask, createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update a task by ID
 * @access Protected
 */
router.put('/:id', validateIdParam, validateTaskUpdate, canAccessTask, updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task by ID
 * @access Protected
 */
router.delete('/:id', validateIdParam, canAccessTask, deleteTask);

module.exports = router;
