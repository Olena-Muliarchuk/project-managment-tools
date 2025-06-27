/**
 * @description Project routes module
 * @module routes/project
 */
const express = require('express');
const router = express.Router();
const {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    getProject,
} = require('../controllers/project.controller');
const authenticate = require('../middleware/auth.middleware');

// Middleware: authenticate all routes
router.use(authenticate);

/**
 * @route POST /api/projects
 * @description Create a new project
 */
router.post('/', createProject);

/**
 * @route GET /api/projects
 * @description Get all projects
 */
router.get('/', getProjects);

/**
 * @route GET /api/projects/:id
 * @description Get project by id
 */
router.get('/:id', getProject);

/**
 * @route PUT /api/projects/:id
 * @description Update a project by ID
 */
router.put('/:id', updateProject);

/**
 * @route DELETE /api/projects/:id
 * @description Delete a project by ID
 */
router.delete('/:id', deleteProject);


module.exports = router;
