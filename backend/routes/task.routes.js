/**
 * @description Tasks routes module
 * @module routes/task
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

/**
 * @route GET /api/tasks
 * @description Get all tasks
 */
router.get('/', getTasks);

/**
 * @route GET /api/tasks/:id
 * @description Get a task by ID
 */
router.get('/:id', getTaskById);

/**
 * @route POST /api/tasks
 * @description Create a new task
 * @access Protected
 */
router.post('/', auth, createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update a task by ID
 * @access Protected
 */
router.put('/:id', auth, updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task by ID
 * @access Protected
 */
router.delete('/:id', auth, deleteTask);

module.exports = router;
