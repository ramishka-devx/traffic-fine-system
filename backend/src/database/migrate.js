require('../config/env'); // Load .env so DB credentials are available
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

const pool = new Pool(env.DB);

async function runMigrations() {
  const client = await pool.connect();

  try {
    // 1: Create the migrations tracking table if it doesn't exist yet.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL UNIQUE,
        run_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);

    // 2: Read all migration files from the /migrations directory, sorted by name.
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();

    for (const file of files) {
      // 3: Check if this migration has already been applied.
      const { rows } = await client.query(
        'SELECT id FROM schema_migrations WHERE name = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`Skipping (already applied): ${file}`);
        continue;
      }

      console.log(`Running migration: ${file}`);

      // 4: Load the migration file and run its `up` function inside a transaction.
      const migration = require(path.join(migrationsDir, file));

      await client.query('BEGIN');
      try {
        await migration.up(client);
        // Record that this migration was successfully applied.
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`  Done: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration failed on ${file}: ${err.message}`);
      }
    }

    console.log('\nAll migrations completed successfully.\n');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('\nMigration error:', err.message);
  process.exit(1);
});
