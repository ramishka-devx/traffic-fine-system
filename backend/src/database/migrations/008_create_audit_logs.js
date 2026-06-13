exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id           SERIAL       PRIMARY KEY,
      actor_id     INTEGER      REFERENCES officers(id) ON DELETE SET NULL,
      action       VARCHAR(50)  NOT NULL,
      target_table VARCHAR(50),
      target_id    INTEGER,
      ip_address   VARCHAR(45),
      metadata     JSONB,
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_audit_actor_id   ON audit_logs(actor_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_audit_action      ON audit_logs(action)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS audit_logs`);
};
