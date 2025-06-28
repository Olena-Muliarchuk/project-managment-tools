const { body } = require('express-validator');
const validate = require('./validate');

/**
 * @description Validation rules for user registration
 */
exports.registerValidator = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['user', 'manager', 'developer'])
        .withMessage('Invalid role. Allowed roles: user, manager, developer'),
    validate,
];

/**
 * @description Validation rules for user login
 */
exports.loginValidator = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];
