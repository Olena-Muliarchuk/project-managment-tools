const userService = require('../services/user.service');

/**
 * @description Get current user's profile
 * @route GET /api/users/me
 * @access Protected
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

/**
 * @description Update current user's profile
 * @route PATCH /api/users/me
 * @access Protected
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.user.id, req.body);
        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        next(err);
    }
};

/**
 * @description Get list of all users
 * @route GET /api/users
 * @access Manager Only
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};
