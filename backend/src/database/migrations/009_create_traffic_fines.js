exports.up = async (client) => {
  // Create the sequence for generating unique FRNs.
  // START WITH 1 means the first FRN will be TF-YYYY-000001.
  await client.query(`
    CREATE SEQUENCE IF NOT EXISTS fine_reference_sequence START WITH 1
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS traffic_fines (
      id                    SERIAL        PRIMARY KEY,
      reference_number      VARCHAR(30)   NOT NULL UNIQUE,
      category_id           INTEGER       NOT NULL
                            REFERENCES fine_categories(id) ON DELETE RESTRICT,
      officer_id            INTEGER       NOT NULL
                            REFERENCES officers(id)        ON DELETE RESTRICT,
      vehicle_number        VARCHAR(20)   NOT NULL,
      driver_license_number VARCHAR(20)   NOT NULL,
      status                VARCHAR(20)   NOT NULL DEFAULT 'UNPAID'
                            CHECK (status IN ('UNPAID', 'PAID', 'CANCELLED')),
      due_date              DATE          NOT NULL,
      notes                 TEXT,
      version               INTEGER       NOT NULL DEFAULT 1,
      created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_fines_reference_number ON traffic_fines(reference_number)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_fines_officer_id ON traffic_fines(officer_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_fines_status ON traffic_fines(status)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_fines_due_date ON traffic_fines(due_date)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS traffic_fines`);
  await client.query(`DROP SEQUENCE IF EXISTS fine_reference_sequence`);
};
