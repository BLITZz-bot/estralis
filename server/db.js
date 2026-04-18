const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// DATABASE_URL format: postgresql://user:password@host:port/database
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
