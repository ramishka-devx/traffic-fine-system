exports.up = async (client) => {
  // Table to store registered driver accounts
  await client.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id                    SERIAL        PRIMARY KEY,
      driver_license_number VARCHAR(20)   NOT NULL UNIQUE,
      mobile_number         VARCHAR(20)   NOT NULL,
      password_hash         VARCHAR(255)  NOT NULL,
      is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
      created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_drivers_license ON drivers(driver_license_number)
  `);

  // Separate refresh token table for drivers. (Cannot reuse the officer refresh_tokens table because it has a hard FK to officers(id) — drivers are not officers.)
  await client.query(`
    CREATE TABLE IF NOT EXISTS driver_refresh_tokens (
      id          SERIAL        PRIMARY KEY,
      driver_id   INTEGER       NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
      token_hash  VARCHAR(255)  NOT NULL UNIQUE,
      expires_at  TIMESTAMPTZ   NOT NULL,
      revoked     BOOLEAN       NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_driver_refresh_tokens_driver_id ON driver_refresh_tokens(driver_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_driver_refresh_tokens_token_hash ON driver_refresh_tokens(token_hash)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS driver_refresh_tokens`);
  await client.query(`DROP TABLE IF EXISTS drivers`);
};
