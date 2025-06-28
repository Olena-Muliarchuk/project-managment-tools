const { body } = require('express-validator');
const validate = require('./validate');

exports.validateProjectCreation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be under 100 characters'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description too long'),
    validate,
];

exports.validateProjectUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Title must be under 100 characters'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description too long'),
    validate,
];
