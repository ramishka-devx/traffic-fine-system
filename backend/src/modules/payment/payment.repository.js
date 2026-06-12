const db = require('../../config/db');

/**
 * Check if a payment already exists by its transaction reference.
 */
exports.findPaymentByReference = async (transactionReference) => {
  const text = 'SELECT id FROM payments WHERE transaction_reference = $1';
  const result = await db.query(text, [transactionReference]);
  return result.rows[0] || null;
};

/**
 * Find a fine by its reference number and lock the row for update (within a transaction).
 */
exports.findFineByReferenceForUpdate = async (client, referenceNumber) => {
  const text = 'SELECT * FROM traffic_fines WHERE reference_number = $1 FOR UPDATE';
  const result = await client.query(text, [referenceNumber]);
  return result.rows[0] || null;
};

/**
 * Update the status of a fine (within a transaction).
 */
exports.updateFineStatus = async (client, fineId, status) => {
  const text = `
    UPDATE traffic_fines 
    SET status = $1, version = version + 1, updated_at = NOW() 
    WHERE id = $2
  `;
  await client.query(text, [status, fineId]);
};

/**
 * Insert a new payment record (within a transaction).
 */
exports.insertPayment = async (client, { fineId, transactionReference, amount, paymentChannel, gatewayName, gatewayResponse }) => {
  const text = `
    INSERT INTO payments (fine_id, transaction_reference, amount, payment_channel, gateway_name, gateway_response, paid_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  const result = await client.query(text, [
    fineId,
    transactionReference,
    amount,
    paymentChannel || 'WEB',
    gatewayName,
    JSON.stringify(gatewayResponse)
  ]);
  return result.rows[0];
};

// Get minimal public payment info for a fine by reference number.

exports.getPublicFineInfo = async (referenceNumber) => {
  const text = `
    SELECT 
      tf.reference_number,
      tf.status,
      fc.base_amount AS amount,
      fc.name AS category_name,
      tf.due_date
    FROM traffic_fines tf
    JOIN fine_categories fc ON tf.category_id = fc.id
    WHERE tf.reference_number = $1
  `;
  const result = await db.query(text, [referenceNumber]);
  return result.rows[0] || null;
};

