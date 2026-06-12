const { body } = require('express-validator');

const loginValidator = [
  body('badge_number')
    .notEmpty()
    .withMessage('Badge number is required')
    .isString()
    .withMessage('Badge number must be a string'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
const refreshTokenValidator = [
  body('refresh_token')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a valid string')
];

module.exports = { loginValidator, refreshTokenValidator };
