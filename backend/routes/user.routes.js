/**
 * @description Users routes module
 * @module routes/user
 */
const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getAllUsers,
} = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

/**
 * @route GET /api/users/me
 * @description Get current user profile
 * @access Protected
 */
router.get('/me', auth, getProfile);

/**
 * @route PATCH /api/users/me
 * @description Update current user profile
 * @access Protected
 */
//TODO: add restriction for changing role
router.patch('/me', auth, updateProfile);

/**
 * @route GET /api/users
 * @description Get all users (only for manager)
 * @access Protected
 */
router.get('/', auth, authorizeRoles('manager'), getAllUsers);

module.exports = router;
