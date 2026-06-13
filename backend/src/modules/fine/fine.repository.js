const db = require('../../config/db');

// Insert a new traffic fine record and return the created row.

exports.insertFine = async (referenceNumber, categoryId, officerId, vehicleNumber, driverLicenseNumber, dueDate, notes) => {
  const text = `
    INSERT INTO traffic_fines(reference_number, category_id, officer_id, vehicle_number, driver_license_number, due_date, notes)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const result = await db.query(text, [
    referenceNumber, categoryId, officerId, vehicleNumber, driverLicenseNumber, dueDate, notes
  ]);
  return result.rows[0];
};

// Find a fine by its reference number joined with its category code (FCI).

exports.findByReferenceAndCategory = async (frn, fci) => {
  const text = `
    SELECT f.*, c.code AS category_code, c.base_amount, c.description
    FROM traffic_fines f
    JOIN fine_categories c ON f.category_id = c.id
    WHERE f.reference_number = $1 AND c.code = $2
  `;
  const result = await db.query(text, [frn, fci]);
  return result.rows[0] || null;
};

// Check that a fine category exists and is active.

exports.findActiveCategoryById = async (categoryId) => {
  const result = await db.query(
    'SELECT * FROM fine_categories WHERE id = $1 AND is_active = true',
    [categoryId]
  );
  return result.rows[0] || null;
};

//Find all fines associated with a specific vehicle number.

exports.findByVehicleNumber = async (vehicleNumber) => {
  const text = `
    SELECT f.reference_number, f.status, c.base_amount AS amount, f.due_date, f.created_at, 
           c.name AS category_name, c.code AS category_code
    FROM traffic_fines f
    JOIN fine_categories c ON f.category_id = c.id
    WHERE f.vehicle_number = $1
    ORDER BY f.created_at DESC
  `;
  const result = await db.query(text, [vehicleNumber]);
  return result.rows;
};

// Find a fine by its reference number.

exports.findByReferenceNumber = async (referenceNumber) => {
  const text = `
    SELECT f.reference_number, f.status, c.base_amount AS amount, f.due_date, f.created_at, 
           c.name AS category_name, c.code AS category_code
    FROM traffic_fines f
    JOIN fine_categories c ON f.category_id = c.id
    WHERE f.reference_number = $1
  `;
  const result = await db.query(text, [referenceNumber]);
  return result.rows[0] || null;
};

// Find all fines for a specific driver license number.
// Used by the DRIVER portal so a driver can view their own fines.

exports.findByLicense = async (licenseNumber) => {
  const text = `
    SELECT f.reference_number, f.status, c.base_amount AS amount, f.due_date, f.created_at,
           c.name AS category_name, c.code AS category_code
    FROM traffic_fines f
    JOIN fine_categories c ON f.category_id = c.id
    WHERE f.driver_license_number = $1
    ORDER BY f.created_at DESC
  `;
  const result = await db.query(text, [licenseNumber]);
  return result.rows;
};
