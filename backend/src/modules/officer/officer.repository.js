const db = require('../../config/db');

// Find all officers. Optional filter for only active ones.
// Used by ADMIN (who can see all officers across all stations).
exports.findAll = async (onlyActive = false) => {
  let queryText = `
    SELECT id, badge_number, full_name, phone_number, role, station_code, is_active, created_at 
    FROM officers
  `;

  if (onlyActive) {
    queryText += ' WHERE is_active = TRUE';
  }

  queryText += ' ORDER BY id ASC';
  const { rows } = await db.query(queryText);
  return rows;
};

// Find officers scoped to a specific station.
// Used by SENIOR_OFFICER who can only see their own station's officers.
exports.findByStation = async (stationCode, onlyActive = false) => {
  let queryText = `
    SELECT id, badge_number, full_name, phone_number, role, station_code, is_active, created_at 
    FROM officers
    WHERE station_code = $1
  `;
  const params = [stationCode];

  if (onlyActive) {
    queryText += ' AND is_active = TRUE';
  }

  queryText += ' ORDER BY id ASC';
  const { rows } = await db.query(queryText, params);
  return rows;
};

// Find an officer by their primary key ID.
exports.findById = async (id) => {
  const queryText = `
    SELECT id, badge_number, full_name, phone_number, role, station_code, is_active 
    FROM officers 
    WHERE id = $1
  `;
  const { rows } = await db.query(queryText, [id]);
  return rows[0] || null;
};

// Find an officer by their badge number. Used for login and duplicate checks.
exports.findByBadgeNumber = async (badgeNumber) => {
  const queryText = 'SELECT * FROM officers WHERE badge_number = $1';
  const { rows } = await db.query(queryText, [badgeNumber]);
  return rows[0] || null;
};

// Insert a new officer.
exports.insert = async (officerData) => {
  const { badge_number, full_name, phone_number, password_hash, role, station_code } = officerData;
  const queryText = `
    INSERT INTO officers (badge_number, full_name, phone_number, password_hash, role, station_code)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, badge_number, full_name, phone_number, role, station_code, is_active
  `;
  const { rows } = await db.query(queryText, [badge_number, full_name, phone_number, password_hash, role, station_code]);
  return rows[0];
};

// Update existing officer — ADMIN only operation.
exports.update = async (id, officerData) => {
  const { full_name, phone_number, role, station_code, is_active } = officerData;
  const queryText = `
    UPDATE officers
    SET full_name = $1, phone_number = $2, role = $3, station_code = $4, is_active = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING id, badge_number, full_name, phone_number, role, station_code, is_active
  `;
  const { rows } = await db.query(queryText, [full_name, phone_number, role, station_code, is_active, id]);
  return rows[0];
};

// Deactivate an officer (soft delete).
exports.deactivate = async (id) => {
  const queryText = `
    UPDATE officers
    SET is_active = FALSE, updated_at = NOW()
    WHERE id = $1
    RETURNING id, badge_number, is_active
  `;
  const { rows } = await db.query(queryText, [id]);
  return rows[0];
};
