-- SQL Schema for Estralis Registrations

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    team_name TEXT,
    team_members JSONB DEFAULT '[]'::jsonb,
    event_title TEXT NOT NULL,
    category TEXT DEFAULT 'Tech',
    amount_paid TEXT,
    pass_type TEXT,
    utr_number TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    screenshot_url TEXT,
    status TEXT DEFAULT 'pending_verification',
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by email (frequently used)
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Index for admin dashboard event filtering
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_title);

-- Table for event statuses (Open/Closed)
CREATE TABLE IF NOT EXISTS events_status (
    id SERIAL PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    is_open BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table for system configuration (Theme Reveal, etc.)
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table for admin-managed allowed colleges
CREATE TABLE IF NOT EXISTS colleges (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial college
INSERT INTO colleges (name) VALUES ('GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT') ON CONFLICT (name) DO NOTHING;
