const env = require('../../config/env');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool(env.DB);

async function addOfficer() {
  const client = await pool.connect();
  try {
    const badge = '38163';
    const fullName = 'Nimal';
    const phone = '+94765688454';
    const password = '111111';
    const role = 'OFFICER';
    const stationCode = 'MTR-01';

    console.log(`Checking if officer ${badge} exists...`);
    const check = await client.query('SELECT id FROM officers WHERE badge_number = $1', [badge]);

    if (check.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await client.query(
        `INSERT INTO officers (badge_number, full_name, phone_number, password_hash, role, station_code)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [badge, fullName, phone, hashedPassword, role, stationCode]
      );
      console.log(`Officer created: Badge: ${badge} | Name: ${fullName}`);
    } else {
      console.log('Officer already exists.');
    }
  } catch (error) {
    console.error('Error adding officer:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addOfficer();
