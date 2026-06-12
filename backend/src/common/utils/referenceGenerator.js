const db = require('../../config/db');

exports.generateFineReferenceNumber = async () => {
  const year = new Date().getFullYear();
  const sequenceQuery = `SELECT nextval('fine_reference_sequence')`;
  
  try {
    const res = await db.query(sequenceQuery);
    const seq = String(res.rows[0].nextval).padStart(6, '0');
    return `TF-${year}-${seq}`;
  } catch (err) {
    // If the sequence is not provisioned, create it dynamically
    if (err.code === '42P01' || err.message.includes('does not exist')) {
      try {
        await db.query(`CREATE SEQUENCE IF NOT EXISTS fine_reference_sequence START WITH 1`);
        const res = await db.query(sequenceQuery);
        const seq = String(res.rows[0].nextval).padStart(6, '0');
        return `TF-${year}-${seq}`;
      } catch (innerErr) {
        throw new Error(`Failed to generate fine reference number sequence: ${innerErr.message}`);
      }
    }
    throw err;
  }
};