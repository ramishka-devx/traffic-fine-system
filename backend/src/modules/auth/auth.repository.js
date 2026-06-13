const db = require('../../config/db');

// Find active officer by badge number for login
exports.findOfficerByBadge = async (badgeNumber) => {
  const queryText = `SELECT * FROM officers WHERE badge_number = $1 AND is_active = true`;
  const { rows } = await db.query(queryText, [badgeNumber]);
  return rows[0] || null;
};

// Save a hashed refresh token to the database
exports.saveRefreshToken = async (officerId, tokenHash, expiresAt) => {
  const queryText = `
    INSERT INTO refresh_tokens (officer_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [officerId, tokenHash, expiresAt]);
  return rows[0];
};

// Find a refresh token (to check if it's valid and not revoked)
exports.findRefreshToken = async (tokenHash) => {
  const queryText = `
    SELECT rt.*, o.role, o.station_code 
    FROM refresh_tokens rt
    JOIN officers o ON rt.officer_id = o.id
    WHERE rt.token_hash = $1
  `;
  const { rows } = await db.query(queryText, [tokenHash]);
  return rows[0] || null;
};

// Revoke a refresh token (used during logout)
exports.revokeRefreshToken = async (tokenHash) => {
  const queryText = `
    UPDATE refresh_tokens 
    SET revoked = TRUE 
    WHERE token_hash = $1
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [tokenHash]);
  return rows[0];
};
