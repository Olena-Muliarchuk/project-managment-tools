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
const { authorizeRoles } = require('../middleware/role.middleware');
const { canCreateProject, } = require('../middleware/permission.middleware');

// Middleware: authenticate all routes
router.use(authenticate);

/**
 * @route POST /api/projects
 * @description Create a new project
 */
router.post('/', authorizeRoles('manager'), canCreateProject, createProject);

/**
 * @route GET /api/projects
 * @description Get all projects
 */
router.get('/', authorizeRoles('manager'), getProjects);

/**
 * @route GET /api/projects/:id
 * @description Get project by id
 */
router.get('/:id', getProject);

/**
 * @route PUT /api/projects/:id
 * @description Update a project by ID
 */
router.put('/:id', authorizeRoles('manager'), updateProject);

/**
 * @route DELETE /api/projects/:id
 * @description Delete a project by ID
 */
router.delete('/:id', authorizeRoles('manager'), deleteProject);


module.exports = router;
