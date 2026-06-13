const paymentService = require('./payment.service');
const paymentRepository = require('./payment.repository');
const payhereAdapter = require('./payhere.adapter');
const asyncHandler = require('../../common/utils/asyncHandler');
const { UnauthorizedError, NotFoundError } = require('../../common/errors/ConcreteErrors');

exports.handlePayHereWebhook = asyncHandler(async (req, res) => {
  const isValidSignature = payhereAdapter.verifySignature(req.body);
  if (!isValidSignature) {
    throw new UnauthorizedError('Invalid payment webhook signature');
  }

  // PayHere expects a 200 OK receipt response to acknowledge the webhook callback
  if (req.body.status_code === '2') { // 2 represents a successful payment settlement
    await paymentService.processWebhookPayment(req.body);
  }

  res.status(200).send('Webhook Processed Successfully');
});

// GET /api/payments/fine/:referenceNumber — Public
// what violation, how much, when due, and the current status.
exports.getPublicFineInfo = asyncHandler(async (req, res) => {
  const { referenceNumber } = req.params;
  const { categoryId } = req.query;

  const fine = await paymentRepository.getPublicFineInfo(referenceNumber);
  if (!fine) {
    throw new NotFoundError(`No fine found with reference number ${referenceNumber}`);
  }

  if (categoryId && fine.categoryId !== categoryId) {
    throw new NotFoundError(`No fine found with reference number ${referenceNumber} and category ${categoryId}`);
  }

  res.status(200).json({
    success: true,
    data: fine
  });
});

exports.initiatePayment = asyncHandler(async (req, res) => {
  const referenceNumber = req.body.reference_number || req.body.referenceNumber;
  const { payerName, payerEmail, payerPhone } = req.body;

  const paymentParams = await paymentService.initiatePayHerePayment({
    referenceNumber,
    payerName,
    payerEmail,
    payerPhone
  });

  res.status(200).json({
    success: true,
    data: paymentParams
  });
});