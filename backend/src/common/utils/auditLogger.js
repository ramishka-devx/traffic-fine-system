const db = require('../../config/db');

/**
 * Logs a critical action to the audit_logs table.
 *
 * @param {number} actorId      - The ID of the officer performing the action.
 * @param {string} action       - The action performed (e.g., 'CREATE', 'UPDATE', 'DEACTIVATE').
 * @param {string} targetTable  - The table/entity type affected (e.g., 'FINE', 'OFFICER').
 * @param {number|string} targetId - The ID of the record affected.
 * @param {Object} metadata     - Additional context (stored as JSONB).
 */
exports.logAction = async (actorId, action, targetTable, targetId, metadata = {}) => {
  try {
    const queryText = `
      INSERT INTO audit_logs (actor_id, action, target_table, target_id, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(queryText, [actorId, action, targetTable, targetId, JSON.stringify(metadata)]);
  } catch (error) {
    // Log the error but do NOT throw — audit failure must not crash the main transaction.
    console.error('Failed to write audit log:', error.message);
  }
};
