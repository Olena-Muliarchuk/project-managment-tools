const authService = require('../services/auth.service');

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.register(email, password, role);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Authenticate user and return JWT
 * @route POST /api/auth/login
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
