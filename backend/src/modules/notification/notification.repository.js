const db = require('../../config/db');

/**
 * Retrieve details of the fine and the issuing officer's phone number for notification dispatch.
 */
exports.getFineDetailsForNotification = async (fineId) => {
  const queryText = `
    SELECT f.reference_number, f.vehicle_number, f.driver_license_number, o.phone_number AS officer_phone, c.base_amount
    FROM traffic_fines f
    JOIN officers o ON f.officer_id = o.id
    JOIN fine_categories c ON f.category_id = c.id
    WHERE f.id = $1
  `;
  const result = await db.query(queryText, [fineId]);
  return result.rows[0] || null;
};

/**
 * Log the SMS dispatch status in the database.
 */
exports.createSmsNotificationLog = async (fineId, recipientPhone, messageBody, status) => {
  const queryText = `
    INSERT INTO sms_notifications (fine_id, recipient_phone, message_body, status, sent_at)
    VALUES ($1, $2, $3, $4, ${status === 'SENT' ? 'NOW()' : 'NULL'})
    RETURNING *
  `;
  const result = await db.query(queryText, [fineId, recipientPhone, messageBody, status]);
  return result.rows[0];
};
