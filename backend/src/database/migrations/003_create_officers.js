exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS officers (
      id            SERIAL       PRIMARY KEY,
      badge_number  VARCHAR(20)  NOT NULL UNIQUE,
      full_name     VARCHAR(150) NOT NULL,
      phone_number  VARCHAR(20)  NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20)  NOT NULL DEFAULT 'OFFICER'
                    CHECK (role IN ('OFFICER', 'SENIOR_OFFICER', 'ADMIN')),
      station_code  VARCHAR(20)  NOT NULL
                    REFERENCES stations(station_code) ON DELETE RESTRICT,
      is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  // Index for fast login lookups by badge_number
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_officers_badge_number ON officers(badge_number)
  `);

  // Index for querying officers by station
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_officers_station_code ON officers(station_code)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS officers`);
};
