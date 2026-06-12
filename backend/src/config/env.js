require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_key_change_me_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  DB: {
    host:     process.env.DB_HOST     || 'pg-1f06f1b6-traffic-fine.d.aivencloud.com',
    user:     process.env.DB_USER     || 'avnadmin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'defaultdb',
    port:     Number(process.env.DB_PORT) || 21471,
    max:      Number(process.env.DB_POOL_MAX) || 20,  
    ssl:      { rejectUnauthorized: false }            
  },
  NOTIFY_LK_API_KEY:   process.env.NOTIFY_LK_API_KEY   || '',
  PAYHERE_MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID || '',
  PAYHERE_SECRET:      process.env.PAYHERE_SECRET      || ''
};