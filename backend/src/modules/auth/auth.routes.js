const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { loginValidator, refreshTokenValidator } = require('./auth.validator');
const validate = require('../../middleware/validate');

// Public route: Login (returns access_token and refresh_token)
router.post('/login', loginValidator, validate, authController.login);

// Public route: Refresh token (returns a new access_token)
router.post('/refresh', refreshTokenValidator, validate, authController.refresh);

// Public route: Logout (revokes the refresh_token)
router.post('/logout', refreshTokenValidator, validate, authController.logout);

module.exports = router;