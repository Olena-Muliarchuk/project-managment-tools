const { body } = require('express-validator');
const validate = require('./validate');

const commonTaskFields = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be under 100 characters'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be under 1000 characters'),

    body('projectId')
        .notEmpty()
        .withMessage('Project ID is required')
        .isInt({ min: 1 })
        .withMessage('Project ID must be a positive integer'),

    body('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('assignedToId must be a positive integer'),
];

exports.validateTaskCreation = [...commonTaskFields, validate];

exports.validateTaskUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Title must be under 100 characters'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be under 1000 characters'),

    body('assignedToId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('assignedToId must be a positive integer'),

    validate,
];
