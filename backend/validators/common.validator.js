const { param } = require('express-validator');
const validate = require('./validate');

/**
 * @description Validate :id params in routes
 */
exports.validateIdParam = [
    param('id')
        .notEmpty()
        .withMessage('ID is required')
        .bail()
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    validate,
];
