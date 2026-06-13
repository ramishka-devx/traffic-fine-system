exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS fine_categories (
      id          SERIAL          PRIMARY KEY,
      code        VARCHAR(20)     NOT NULL UNIQUE,
      name        VARCHAR(150)    NOT NULL,
      description TEXT,
      base_amount NUMERIC(10, 2)  NOT NULL,
      is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
    )
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS fine_categories`);
};
