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
            CREATE TABLE IF NOT EXISTS event_slots (
                event_title TEXT PRIMARY KEY,
                max_slots INTEGER DEFAULT 200,
                is_manual_open BOOLEAN DEFAULT TRUE
            );
        `);
        // Seed default limit for DJ Night if not exists
        await pool.query(`
            INSERT INTO event_slots (event_title, max_slots, is_manual_open) 
            VALUES ('ARTIST PERFORMANCE AND DJ NIGHT', 200, TRUE) 
            ON CONFLICT (event_title) DO NOTHING;
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
