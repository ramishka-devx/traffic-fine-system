const env = require('../../config/env');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { seedDistricts } = require('./districts.seed');
const { seedCategories } = require('./categories.seed');
const { seedStations } = require('./stations.seed');

const pool = new Pool(env.DB);

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Starting Database Seeding...');

    // 1. Seed Districts
    await seedDistricts(client);

    // 1.5 Seed Stations
    await seedStations(client);

    // 2. Seed Categories
    await seedCategories(client);

    // 3. Seed Super Admin
    console.log('Inserting Super Admin...');
    const adminBadge = 'ADMIN-001';
    
    // Check if admin already exists
    const checkAdmin = await client.query('SELECT id FROM officers WHERE badge_number = $1', [adminBadge]);
    
    if (checkAdmin.rows.length === 0) {
      // Get the Colombo station code to assign the admin to
      const colomboHQ = await client.query("SELECT station_code FROM stations WHERE station_code = 'CMB-01'");
      const stationCode = colomboHQ.rows[0].station_code;

      // Hash the password '111111'
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('111111', salt);

      await client.query(
        `INSERT INTO officers (badge_number, full_name, phone_number, password_hash, role, station_code)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adminBadge, 'System Administrator', '+94700000000', hashedPassword, 'ADMIN', stationCode]
      );
      console.log('Super Admin created: Badge: ADMIN-001 | Password: 111111');
    } else {
      console.log('Super Admin already exists.');
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
