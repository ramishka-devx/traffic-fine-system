const { body, param } = require('express-validator');
const ROLES = require('../../common/constants/roles');

exports.createOfficerValidator = [
  body('badge_number')
    .trim()
    .notEmpty().withMessage('Badge number is required')
    .isLength({ min: 3, max: 20 }).withMessage('Badge number must be between 3 and 20 characters'),
  
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 150 }).withMessage('Full name cannot exceed 150 characters'),
  
  body('phone_number')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number format (E.164 format recommended)'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),

  // station_code is optional here because:
  //   - SENIOR_OFFICER: station is forced from their JWT token server-side (body value ignored)
  //   - ADMIN: must provide a valid station_code to assign the new officer
  body('station_code')
    .optional()
    .trim()
    .notEmpty().withMessage('Station code cannot be empty if provided')
    .isLength({ max: 20 }).withMessage('Station code cannot exceed 20 characters')
];

exports.updateOfficerValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid officer ID parameter'),

  body('full_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Full name cannot be empty if provided')
    .isLength({ max: 150 }).withMessage('Full name cannot exceed 150 characters'),
  
  body('phone_number')
    .optional()
    .trim()
    .notEmpty().withMessage('Phone number cannot be empty if provided')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number format'),
  
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),

  body('station_code')
    .optional()
    .trim()
    .notEmpty().withMessage('Station code cannot be empty if provided')
    .isLength({ max: 20 }).withMessage('Station code cannot exceed 20 characters'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean value')
];

exports.officerIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid officer ID parameter')
];
