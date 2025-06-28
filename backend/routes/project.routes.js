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
const { canCreateProject } = require('../middleware/permission.middleware');
const {
    validateProjectCreation,
    validateProjectUpdate,
} = require('../validators/project.validator');
const { validateIdParam } = require('../validators/common.validator');

// Apply authentication to all project routes
router.use(authenticate);

/**
 * @route POST /api/projects
 * @description Create a new project
 * @access Manager only
 */
router.post(
    '/',
    authorizeRoles('manager'),
    validateProjectCreation,
    canCreateProject,
    createProject
);

/**
 * @route GET /api/projects
 * @description Get all projects
 * @access Manager only
 */
router.get('/', authorizeRoles('manager'), getProjects);

/**
 * @route GET /api/projects/:id
 * @description Get project by ID
 * @access Authenticated
 */
router.get('/:id', validateIdParam, getProject);

/**
 * @route PUT /api/projects/:id
 * @description Update a project by ID
 * @access Manager only
 */
router.put(
    '/:id',
    validateIdParam,
    authorizeRoles('manager'),
    validateProjectUpdate,
    updateProject
);

/**
 * @route DELETE /api/projects/:id
 * @description Delete a project by ID
 * @access Manager only
 */
router.delete('/:id', validateIdParam, authorizeRoles('manager'), deleteProject);

module.exports = router;
