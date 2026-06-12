const { body, param, query } = require('express-validator');

// Validation rules for POST / (issue a fine).
// Only authenticated officers reach this route, so we validate the body payload.

const issueFineValidator = [
  body('vehicleNumber')
    .notEmpty().withMessage('Vehicle number is required')
    .isString().withMessage('Vehicle number must be a string')
    .trim(),

  body('driverLicenseNumber')
    .notEmpty().withMessage('Driver license number is required')
    .isString().withMessage('Driver license number must be a string')
    .trim(),

  body('categoryId')
    .notEmpty().withMessage('Category ID is required')
    .isInt({ gt: 0 }).withMessage('Category ID must be a positive integer'),

  body('notes')
    .optional()
    .isString().withMessage('Notes must be a string')
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
    .trim(),
];

// Validation rules for GET /:referenceNumber (lookup a fine).
// The FCI (categoryCode) query parameter is mandatory — without it the
// service cannot uniquely identify the fine.

const lookupFineValidator = [
  param('referenceNumber')
    .notEmpty().withMessage('Reference number is required')
    .matches(/^TF-\d{4}-\d{6}$/).withMessage('Reference number must be in format TF-YYYY-NNNNNN'),

  query('categoryCode')
    .notEmpty().withMessage('Category code (FCI) is required')
    .isString().withMessage('Category code must be a string')
    .trim(),
];

// Validation rules for GET /status/verify
// Requires referenceNumber or a vehicleNumber in the query.

const verifyStatusValidator = [
  query('referenceNumber')
    .optional()
    .trim()
    .matches(/^TF-\d{4}-\d{6}$/).withMessage('Reference number must be in format TF-YYYY-NNNNNN'),
    
  query('vehicleNumber')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage('Invalid vehicle number format'),

  // at least one
  query().custom((value, { req }) => {
    if (!req.query.referenceNumber && !req.query.vehicleNumber) {
      throw new Error('Either referenceNumber or vehicleNumber must be provided');
    }
    return true;
  })
];

module.exports = { issueFineValidator, lookupFineValidator, verifyStatusValidator };
