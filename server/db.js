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

// Auto-initialize tables
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS colleges (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await pool.query(`
            INSERT INTO colleges (name) VALUES ('GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT') ON CONFLICT (name) DO NOTHING;
        `);
        console.log('✅ Database Schema Verified/Initialized');
    } catch (err) {
        console.error('❌ Database Initialization Error:', err.message);
    }
};

initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
