const db = require('../../config/db');

// Fetch all fine categories.
// If true, returns only active categories.
exports.findAll = async (onlyActive = false) => {
  let queryText = 'SELECT * FROM fine_categories';
  const params = [];

  if (onlyActive) {
    queryText += ' WHERE is_active = TRUE';
  }

  queryText += ' ORDER BY code ASC';
  const { rows } = await db.query(queryText, params);
  return rows;
};

// Find a fine category by primary key ID.
exports.findById = async (id) => {
  const queryText = 'SELECT * FROM fine_categories WHERE id = $1';
  const { rows } = await db.query(queryText, [id]);
  return rows[0] || null;
};

// Find a fine category by its unique code (FCI).
exports.findByCode = async (code) => {
  const queryText = 'SELECT * FROM fine_categories WHERE code = $1';
  const { rows } = await db.query(queryText, [code]);
  return rows[0] || null;
};

// Insert a new fine category into the database.
exports.insert = async (categoryData) => {
  const { code, name, description, base_amount } = categoryData;
  const queryText = `
    INSERT INTO fine_categories (code, name, description, base_amount)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [code, name, description, base_amount]);
  return rows[0];
};

// Update fine category's fields.
exports.update = async (id, categoryData) => {
  const { name, description, base_amount, is_active } = categoryData;
  const queryText = `
    UPDATE fine_categories
    SET name = $1, description = $2, base_amount = $3, is_active = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [name, description, base_amount, is_active, id]);
  return rows[0];
};

// Soft delete (deactivate) a fine category.
exports.deactivate = async (id) => {
  const queryText = `
    UPDATE fine_categories
    SET is_active = FALSE, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [id]);
  return rows[0];
};
