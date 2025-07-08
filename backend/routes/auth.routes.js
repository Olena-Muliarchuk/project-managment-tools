/**
 * @description Auth routes module
 * @module routes/auth
 */
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refresh,
    logout,
} = require('../controllers/auth.controller');
const {
    registerValidator,
    loginValidator,
    refreshValidator,
    logoutValidator,
} = require('../validators/auth.validator');
const verifyRefreshToken = require('../middleware/refreshToken.midleware');
const logoutMiddleware = require('../middleware/logout.middleware');

/**
 * @route POST /api/auth/register
 * @description Register new user
 */
router.post('/register', registerValidator, register);

/**
 * @route POST /api/auth/login
 * @description Log in user and return JWT
 */
router.post('/login', loginValidator, login);

/**
 * @route POST /api/auth/refresh
 * @description Refresh access and refresh tokens
 */
router.post('/refresh', refreshValidator, verifyRefreshToken, refresh);

/**
 * @route POST /api/auth/logout
 * @description Invalidate refresh token and log out user
 */
router.post('/logout', logoutValidator, logoutMiddleware, logout);

module.exports = router;
