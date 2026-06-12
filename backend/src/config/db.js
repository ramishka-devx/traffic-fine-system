const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool(env.DB);

pool.on('connect', () => {
  // Connection monitoring
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client pool', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getTransaction: async () => {
    const client = await pool.connect();
    const query = client.query.bind(client);
    const release = client.release.bind(client);
    return { client, query, release };
  }
};