const db = require('../../config/db');

// Get overall dashboard summary metrics
exports.getDashboardSummary = async () => {
  const queryText = `
    SELECT 
      COUNT(*) AS total_fines_issued,
      COUNT(*) FILTER (WHERE tf.status = 'UNPAID') AS total_unpaid_fines,
      COUNT(*) FILTER (WHERE tf.status = 'PAID') AS total_paid_fines,
      COALESCE(SUM(fc.base_amount) FILTER (WHERE tf.status = 'PAID'), 0) AS total_revenue_collected
    FROM traffic_fines tf
    JOIN fine_categories fc ON tf.category_id = fc.id;
  `;
  const { rows } = await db.query(queryText);
  return rows[0];
};

// Get a breakdown of fines by district
exports.getFinesByDistrict = async () => {
  const queryText = `
    SELECT 
      d.name as district_name,
      COUNT(tf.id) as total_fines,
      COALESCE(SUM(fc.base_amount) FILTER (WHERE tf.status = 'PAID'), 0) as revenue
    FROM districts d
    LEFT JOIN stations s ON d.id = s.district_id
    LEFT JOIN officers o ON s.station_code = o.station_code
    LEFT JOIN traffic_fines tf ON o.id = tf.officer_id
    LEFT JOIN fine_categories fc ON tf.category_id = fc.id
    GROUP BY d.name
    ORDER BY total_fines DESC;
  `;
  const { rows } = await db.query(queryText);
  return rows;
};

// Get the latest 10 fines issued in the system
exports.getRecentFines = async () => {
  const queryText = `
    SELECT 
      tf.id, tf.reference_number, tf.vehicle_number, tf.status, fc.base_amount, tf.created_at,
      fc.name as violation,
      o.full_name as officer_name
    FROM traffic_fines tf
    JOIN fine_categories fc ON tf.category_id = fc.id
    JOIN officers o ON tf.officer_id = o.id
    ORDER BY tf.created_at DESC
    LIMIT 10;
  `;
  const { rows } = await db.query(queryText);
  return rows;
};
