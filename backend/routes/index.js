const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

// Test
router.get('/ping', (req, res) => {
    res.status(200).json({ success: true, message: 'pong' });
});

module.exports = router;
