const db = require('../../config/db');

// Find a driver by their license number.
// Used for duplicate check on register, and for login.
exports.findByLicense = async (licenseNumber) => {
  const queryText = 'SELECT * FROM drivers WHERE driver_license_number = $1';
  const { rows } = await db.query(queryText, [licenseNumber]);
  return rows[0] || null;
};

// Insert a new driver account.
exports.insert = async (driverData) => {
  const { driver_license_number, mobile_number, password_hash } = driverData;
  const queryText = `
    INSERT INTO drivers (driver_license_number, mobile_number, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, driver_license_number, mobile_number, is_active, created_at
  `;
  const { rows } = await db.query(queryText, [driver_license_number, mobile_number, password_hash]);
  return rows[0];
};

// Check whether a given license number has at least one fine issued.
// This is the registration guard — only drivers with an actual fine can register.
exports.hasFine = async (licenseNumber) => {
  const queryText = `
    SELECT 1 FROM traffic_fines
    WHERE driver_license_number = $1
    LIMIT 1
  `;
  const { rows } = await db.query(queryText, [licenseNumber]);
  return rows.length > 0;
};

// Save a hashed refresh token for a driver.
exports.saveRefreshToken = async (driverId, tokenHash, expiresAt) => {
  const queryText = `
    INSERT INTO driver_refresh_tokens (driver_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [driverId, tokenHash, expiresAt]);
  return rows[0];
};

// Find a driver refresh token by its hash.
exports.findRefreshToken = async (tokenHash) => {
  const queryText = `
    SELECT drt.*, d.is_active
    FROM driver_refresh_tokens drt
    JOIN drivers d ON drt.driver_id = d.id
    WHERE drt.token_hash = $1
  `;
  const { rows } = await db.query(queryText, [tokenHash]);
  return rows[0] || null;
};

// Revoke a driver refresh token.
exports.revokeRefreshToken = async (tokenHash) => {
  const queryText = `
    UPDATE driver_refresh_tokens
    SET revoked = TRUE
    WHERE token_hash = $1
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [tokenHash]);
  return rows[0];
};
