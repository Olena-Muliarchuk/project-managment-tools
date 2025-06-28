const projectService = require('../services/project.service');

/**
 * @description Create a new project
 * @route POST /api/projects
 * @access Protected
 */
exports.createProject = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        const newProject = await projectService.createProject({
            title,
            description,
            ownerId: userId,
        });

        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
};

/**
 * @description Get all projects
 * @route GET /api/projects
 * @access Public
 */
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getProjects();
        res.status(200).json(projects);
    } catch (err) {
        next(err);
    }
};

/**
 * @description Get a project by ID
 * @route GET /api/projects/:id
 * @access Public
 */
exports.getProject = async (req, res, next) => {
    try {
        const project = await projectService.getProject(Number(req.params.id));
        if (!project) {
            const error = new Error(
                `Project with ID ${req.params.id} not found`
            );
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(project);
    } catch (err) {
        next(err);
    }
};

/**
 * @description Update a project by ID
 * @route PUT /api/projects/:id
 * @access Protected
 */
exports.updateProject = async (req, res, next) => {
    try {
        const updatedProject = await projectService.updateProject(
            Number(req.params.id), // id has int type in db
            req.body
        );
        res.status(200).json(updatedProject);
    } catch (err) {
        next(err);
    }
};

/**
 * @description Delete a project by ID
 * @route DELETE /api/projects/:id
 * @access Protected
 */
exports.deleteProject = async (req, res, next) => {
    try {
        const deletedProject = await projectService.deleteProject(
            Number(req.params.id)
        );
        res.status(200).json({ success: true, deletedProject });
    } catch (err) {
        next(err);
    }
};
