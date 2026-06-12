const { body, param } = require('express-validator');

exports.createCategoryValidator = [
  body('code')
    .trim()
    .notEmpty().withMessage('Category code is required')
    .isLength({ min: 2, max: 20 }).withMessage('Category code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9-]+$/).withMessage('Category code must consist of uppercase alphanumeric characters and hyphens only (e.g. SPD-01)'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 150 }).withMessage('Category name cannot exceed 150 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('base_amount')
    .notEmpty().withMessage('Base amount is required')
    .isNumeric().withMessage('Base amount must be a number')
    .custom(value => Number(value) >= 0).withMessage('Base amount cannot be negative')
];

exports.updateCategoryValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid category ID parameter'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty if provided')
    .isLength({ max: 150 }).withMessage('Category name cannot exceed 150 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('base_amount')
    .optional()
    .isNumeric().withMessage('Base amount must be a number')
    .custom(value => Number(value) >= 0).withMessage('Base amount cannot be negative'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean value')
];

exports.categoryIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid category ID parameter')
];
