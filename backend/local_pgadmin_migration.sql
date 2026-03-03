-- 1. Create Roles and Insert Defaults
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}'
);

INSERT INTO roles (role_name) VALUES ('admin'), ('user') ON CONFLICT DO NOTHING;

-- 2. Create User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    native_language VARCHAR(50) DEFAULT 'English',
    default_currency VARCHAR(10) DEFAULT 'USD',
    avatar_url TEXT
);

-- Migrating existing user native languages
INSERT INTO user_profiles (user_id, native_language)
SELECT id, COALESCE(native_language, 'English') FROM users
ON CONFLICT (user_id) DO NOTHING;

-- 3. Create User Roles Junction
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Migrating existing user roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.role_name = LOWER(COALESCE(u.role, 'user'))
ON CONFLICT DO NOTHING;

-- 4. Create Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    UNIQUE(city_name, country_name)
);

-- Migrate unique destinations from trips
INSERT INTO destinations (city_name, country_name)
SELECT DISTINCT COALESCE(destination, 'Unknown'), 'Unknown'
FROM trips WHERE destination IS NOT NULL
ON CONFLICT (city_name, country_name) DO NOTHING;

-- 5. Create Trip Destinations Junction
CREATE TABLE IF NOT EXISTS trip_destinations (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    destination_id INTEGER REFERENCES destinations(id) ON DELETE RESTRICT,
    visit_order INTEGER DEFAULT 1,
    arrival_date DATE,
    departure_date DATE
);

-- Link trips to destinations
INSERT INTO trip_destinations (trip_id, destination_id)
SELECT t.id, d.id
FROM trips t
JOIN destinations d ON d.city_name = COALESCE(t.destination, 'Unknown')
ON CONFLICT DO NOTHING;

-- 6. Create Custom Checklists
CREATE TABLE IF NOT EXISTS custom_checklists (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    list_title VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generate a parent checklist for existing lists
INSERT INTO custom_checklists (trip_id, user_id, list_title)
SELECT DISTINCT trip_id, user_id, 'Original Checklist'
FROM checklists
ON CONFLICT DO NOTHING;

-- 7. Create Checklist Items
CREATE TABLE IF NOT EXISTS checklist_items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER REFERENCES custom_checklists(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link items to the newly generated lists
INSERT INTO checklist_items (checklist_id, item_name, is_checked)
SELECT cc.id, c.item_name, c.is_checked
FROM custom_checklists cc
JOIN checklists c ON c.trip_id = cc.trip_id AND c.user_id = cc.user_id;

-- 8. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(50),
    description TEXT,
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Cleanup Obsolete Columns
ALTER TABLE users DROP COLUMN IF EXISTS role;
ALTER TABLE users DROP COLUMN IF EXISTS native_language;
ALTER TABLE trips DROP COLUMN IF EXISTS destination;
DROP TABLE IF EXISTS checklists;
