const env = require('../../config/env');
const { Pool } = require('pg');

const pool = new Pool(env.DB);

async function run() {
  const client = await pool.connect();
  try {
    console.log("Checking for test fine...");
    const ref = "TF-2026-000002";
    const check = await client.query("SELECT id FROM traffic_fines WHERE reference_number = $1", [ref]);
    
    if (check.rows.length === 0) {
      const officer = await client.query("SELECT id FROM officers WHERE badge_number = 'ADMIN-001'");
      if (officer.rows.length === 0) {
        throw new Error("No officer ADMIN-001 found. Please run db:seed first.");
      }
      const officerId = officer.rows[0].id;
      
      const category = await client.query("SELECT id FROM fine_categories WHERE code = 'SPD-01'");
      if (category.rows.length === 0) {
        throw new Error("No category SPD-01 found. Please run db:seed first.");
      }
      const categoryId = category.rows[0].id;

      await client.query(`
        INSERT INTO traffic_fines (reference_number, category_id, officer_id, vehicle_number, driver_license_number, status, due_date, notes)
        VALUES ($1, $2, $3, 'WP-CAS-1234', 'B1234567', 'UNPAID', NOW() + INTERVAL '14 days', 'Test speeding fine')
      `, [ref, categoryId, officerId]);
      
      console.log("Test fine created: TF-2026-000002");
    } else {
      console.log("Test fine already exists.");
    }
  } catch (err) {
    console.error("Failed to insert test fine:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
