const db = require('../../config/db');
const { ConflictError, NotFoundError } = require('../../common/errors/ConcreteErrors');
const paymentRepository = require('./payment.repository');
const FINE_STATUS = require('../../common/constants/fineStatus');
const smsService = require('../notification/sms.service');
const auditLogger = require('../../common/utils/auditLogger');
const payhereAdapter = require('./payhere.adapter');
const env = require('../../config/env');


exports.processWebhookPayment = async (webhookData) => {
  const { order_id, payment_id, payhere_amount, payment_channel } = webhookData;

  // 1. Idempotency guard check against duplicate payments
  const existingPayment = await paymentRepository.findPaymentByReference(payment_id);
  if (existingPayment) {
    return { status: 'ignored', message: 'Transaction already successfully cataloged' };
  }

  // 2. Open an isolated transaction context block
  const { client, query, release } = await db.getTransaction();

  try {
    await query('BEGIN');

    // 3. Obtain a row-level isolation lock using a row lock mechanism
    const fine = await paymentRepository.findFineByReferenceForUpdate(client, order_id);

    if (!fine) {
      throw new NotFoundError(`Fine target sequence ${order_id} cannot be isolated`);
    }
    if (fine.status === FINE_STATUS.PAID) {
      throw new ConflictError('This fine has already been paid');
    }

    // 4. Mark the fine as PAID
    await paymentRepository.updateFineStatus(client, fine.id, FINE_STATUS.PAID);

    // 5. Build payment record entries
    await paymentRepository.insertPayment(client, {
      fineId: fine.id,
      transactionReference: payment_id,
      amount: payhere_amount,
      paymentChannel: payment_channel || 'WEB',
      gatewayName: 'PayHere',
      gatewayResponse: webhookData
    });

    // LOG THE ACTION (Automated system action, so officerId is null)
    await auditLogger.logAction(null, 'PROCESS', 'PAYMENT', fine.id, {
      transaction_id: payment_id,
      amount: payhere_amount
    });

    await query('COMMIT');
    
    // 6. Asynchronously trigger communication workflows without blocking database connection allocations
    if (smsService && typeof smsService.dispatchPaymentConfirmationMessage === 'function') {
      smsService.dispatchPaymentConfirmationMessage(fine.id).catch(console.error);
    } else {
      console.warn('SMS service not initialized or dispatchPaymentConfirmationMessage is not a function');
    }

    return { status: 'success', fineId: fine.id };
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  } finally {
    release();
  }
};

exports.initiatePayHerePayment = async ({ referenceNumber, payerName, payerEmail, payerPhone }) => {
  // 1. Get fine details
  const fine = await paymentRepository.getPublicFineInfo(referenceNumber);
  if (!fine) {
    throw new NotFoundError(`No fine found with reference number ${referenceNumber}`);
  }

  if (fine.status === FINE_STATUS.PAID) {
    throw new ConflictError('This fine has already been paid');
  }

  // 2. Generate PayHere checkout parameters
  const amount = fine.amountLkr;
  const orderId = fine.referenceNumber;
  const currency = 'LKR';

  const merchantId = env.PAYHERE_MERCHANT_ID || '1224441';
  
  // Split payerName into first_name and last_name
  const nameParts = (payerName || 'Payer Name').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Traffic';
  const lastName = nameParts.slice(1).join(' ') || 'Payer';

  const hash = payhereAdapter.generateCheckoutHash(orderId, amount, currency);

  return {
    sandbox: env.NODE_ENV !== 'production',
    merchant_id: merchantId,
    order_id: orderId,
    items: `Traffic Fine - ${fine.violation || 'Payment'}`,
    amount: parseFloat(amount).toFixed(2),
    currency,
    hash,
    first_name: firstName,
    last_name: lastName,
    email: payerEmail || 'payer@example.com',
    phone: payerPhone || '0771234567',
    address: 'Sri Lanka Police Department',
    city: 'Colombo',
    country: 'Sri Lanka'
  };
};