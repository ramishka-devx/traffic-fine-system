const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { payhereWebhookValidator, initiatePaymentValidator } = require('./payment.validator');
const validate = require('../../middleware/validate');

// Public webhook route — accepts PayHere payment gateway notification callbacks
router.post(
  '/webhook',
  payhereWebhookValidator,
  validate,
  paymentController.handlePayHereWebhook
);

// POST /api/payments/initiate — Public
// Initiates payment parameters for PayHere Checkout sandbox
router.post(
  '/initiate',
  initiatePaymentValidator,
  validate,
  paymentController.initiatePayment
);

// GET /api/payments/fine/:referenceNumber — Public
// Returns only minimal fields: reference number, status, amount, category, due date.
router.get(
  '/fine/:referenceNumber',
  paymentController.getPublicFineInfo
);

module.exports = router;