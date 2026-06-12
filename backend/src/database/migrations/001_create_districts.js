exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS districts (
      id         SERIAL       PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      code       VARCHAR(10)  NOT NULL UNIQUE,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS districts`);
};
