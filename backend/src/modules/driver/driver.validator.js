const { body } = require('express-validator');

exports.registerValidator = [
  body('driver_license_number')
    .trim()
    .notEmpty().withMessage('Driver license number is required')
    .isLength({ min: 5, max: 20 }).withMessage('License number must be between 5 and 20 characters')
    .matches(/^[A-Z0-9-]+$/).withMessage('License number must contain only uppercase letters, numbers, and dashes'),

  body('mobile_number')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid mobile number format (E.164 format recommended)'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginValidator = [
  body('driver_license_number')
    .trim()
    .notEmpty().withMessage('Driver license number is required'),

  body('password')
    .notEmpty().withMessage('Password is required')
];
