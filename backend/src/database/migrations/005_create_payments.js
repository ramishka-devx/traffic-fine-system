exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id                    SERIAL          PRIMARY KEY,
      fine_id               INTEGER         NOT NULL UNIQUE
                            REFERENCES traffic_fines(id) ON DELETE RESTRICT,
      transaction_reference VARCHAR(100)    NOT NULL UNIQUE,
      amount                NUMERIC(10, 2)  NOT NULL,
      payment_channel       VARCHAR(30)     NOT NULL DEFAULT 'WEB',
      gateway_name          VARCHAR(50)     NOT NULL,
      gateway_response      JSONB,
      paid_at               TIMESTAMPTZ     NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_payments_fine_id ON payments(fine_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_payments_transaction_reference ON payments(transaction_reference)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS payments`);
};
