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

module.exports = { payhereWebhookValidator };
