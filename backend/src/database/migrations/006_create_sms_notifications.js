exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS sms_notifications (
      id              SERIAL       PRIMARY KEY,
      fine_id         INTEGER      NOT NULL
                      REFERENCES traffic_fines(id) ON DELETE CASCADE,
      recipient_phone VARCHAR(20)  NOT NULL,
      message_body    TEXT         NOT NULL,
      status          VARCHAR(10)  NOT NULL
                      CHECK (status IN ('SENT', 'FAILED')),
      sent_at         TIMESTAMPTZ,
      created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_sms_fine_id ON sms_notifications(fine_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_sms_status ON sms_notifications(status)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS sms_notifications`);
};
