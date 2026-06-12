const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { payhereWebhookValidator } = require('./payment.validator');
const validate = require('../../middleware/validate');

// Public webhook route — accepts PayHere payment gateway notification callbacks
router.post(
  '/webhook',
  payhereWebhookValidator,
  validate,
  paymentController.handlePayHereWebhook
);

// GET /api/payments/fine/:referenceNumber — Public
// Returns only minimal fields: reference number, status, amount, category, due date.
router.get(
  '/fine/:referenceNumber',
  paymentController.getPublicFineInfo
);

module.exports = router;