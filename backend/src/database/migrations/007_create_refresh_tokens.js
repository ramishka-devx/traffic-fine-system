exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          SERIAL       PRIMARY KEY,
      officer_id  INTEGER      NOT NULL
                  REFERENCES officers(id) ON DELETE CASCADE,
      token_hash  VARCHAR(255) NOT NULL UNIQUE,
      expires_at  TIMESTAMPTZ  NOT NULL,
      revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_officer_id  ON refresh_tokens(officer_id)
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash  ON refresh_tokens(token_hash)
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS refresh_tokens`);
};
