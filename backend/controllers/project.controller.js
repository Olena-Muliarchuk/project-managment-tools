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
        console.error('[Create Project]', err);
        next(err); // let global error handler catch it
    }
};
/**
 * @description Get all projects
 * @route GET /api/projects
 * @access Public
 * @returns {void}
 */
exports.getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('[Get Projects]', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
/**
 * @description Get a project by ID
 * @route GET /api/projects/:id
 * @access Public
 * @returns {void}
 */
exports.getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const projects = await projectService.getProject(Number(id));
        res.status(200).json(projects);
    } catch (error) {
        console.error('[Get Project]', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @description Update a project by ID
 * @route PUT /api/projects/:id
 * @access Protected
 * @returns {void}
 */
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const updatedProject = await projectService.updateProject(Number(id), {
            // id has int type in db
            title,
            description,
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('[Update Project]', error);

        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @description Delete a project by ID
 * @route DELETE /api/projects/:id
 * @access Protected
 * @returns {void}
 */
exports.deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await projectService.deleteProject(Number(id));
        res.status(200).json({ success: true, deletedProject });
    } catch (error) {
        console.error('[Delete Project]', error);

        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};
