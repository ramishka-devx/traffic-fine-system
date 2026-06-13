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
router.get(
  '/fine/:referenceNumber',
  paymentController.getPublicFineInfo
);

// GET /api/payments/license/:licenseNumber — Public (NEW)
router.get(
  '/license/:licenseNumber',
  paymentController.getPublicFinesByLicense
);

module.exports = router;