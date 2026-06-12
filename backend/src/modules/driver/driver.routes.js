const express = require('express');
const router = express.Router();
const driverController = require('./driver.controller');
const { registerValidator, loginValidator } = require('./driver.validator');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const ROLES = require('../../common/constants/roles');

// Any user can attempt to register; the service enforces the "must have a fine" guard.
router.post(
  '/register',
  registerValidator,
  validate,
  driverController.register
);

// Returns a JWT access token and refresh token on success.
router.post(
  '/login',
  loginValidator,
  validate,
  driverController.login
);

// Returns all fines associated with the logged-in driver's license number.
// Officers cannot access this endpoint even with a valid officer JWT.
router.get(
  '/fines',
  authenticate,
  authorize(ROLES.DRIVER),
  driverController.getMyFines
);

module.exports = router;
