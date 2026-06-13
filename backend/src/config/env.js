require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_only_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  DB: {
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:     Number(process.env.DB_PORT) || 5432,
    max:      Number(process.env.DB_POOL_MAX) || 20,  
    ssl:      false // Set to false for this specific database connection
  },
  NOTIFY_LK_API_KEY:   process.env.NOTIFY_LK_API_KEY   || '',
  PAYHERE_MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID || '',
  PAYHERE_SECRET:      process.env.PAYHERE_SECRET      || ''
};
