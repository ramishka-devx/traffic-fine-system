exports.up = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS stations (
      station_code  VARCHAR(20)   PRIMARY KEY,
      name          VARCHAR(150)  NOT NULL,
      district_id   INTEGER       NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
      is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
      created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE INDEX idx_stations_district_id ON stations(district_id);
  `);
};

exports.down = async (client) => {
  await client.query(`DROP TABLE IF EXISTS stations`);
};
