/**
 * @description Auth routes module
 * @module routes/auth
 */
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

/**
 * @route POST /api/auth/register
 * @description Register new user
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @description Log in user and return JWT
 */
router.post('/login', login);

module.exports = router;
