const { body } = require('express-validator');

/**
 * Validation rules for POST /payment/webhook.
 * Verifies all required PayHere checkout notification parameters.
 */
const payhereWebhookValidator = [
  body('merchant_id')
    .notEmpty().withMessage('Merchant ID is required')
    .isString().withMessage('Merchant ID must be a string'),

  body('order_id')
    .notEmpty().withMessage('Order ID is required')
    .isString().withMessage('Order ID must be a string'),

  body('payment_id')
    .notEmpty().withMessage('Payment ID is required')
    .isString().withMessage('Payment ID must be a string'),

  body('payhere_amount')
    .notEmpty().withMessage('PayHere amount is required')
    .isString().withMessage('PayHere amount must be a string'),

  body('payhere_currency')
    .notEmpty().withMessage('PayHere currency is required')
    .isString().withMessage('PayHere currency must be a string'),

  body('status_code')
    .notEmpty().withMessage('Status code is required')
    .isString().withMessage('Status code must be a string'),

  body('md5sig')
    .notEmpty().withMessage('MD5 signature is required')
    .isString().withMessage('MD5 signature must be a string')
];

/**
 * Validation rules for POST /payment/initiate.
 * Verifies the reference number is provided (either as reference_number or referenceNumber).
 */
const initiatePaymentValidator = [
  body('reference_number')
    .optional()
    .isString().withMessage('Reference number must be a string'),
  body('referenceNumber')
    .optional()
    .isString().withMessage('Reference number must be a string'),
  body().custom((value, { req }) => {
    if (!req.body.reference_number && !req.body.referenceNumber) {
      throw new Error('Reference number is required (as reference_number or referenceNumber)');
    }
    return true;
  }),
  body('payerName')
    .optional()
    .isString().withMessage('Payer name must be a string'),
  body('payerEmail')
    .optional({ values: 'falsy' })
    .isEmail().withMessage('Payer email must be a valid email address'),
  body('payerPhone')
    .optional()
    .isString().withMessage('Payer phone must be a string')
];

module.exports = { payhereWebhookValidator, initiatePaymentValidator };

