-- Down migration
ALTER TABLE trip_destinations ADD COLUMN departure_date DATE;
ALTER TABLE trip_destinations ADD COLUMN arrival_date DATE;
ALTER TABLE destinations ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE destinations ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE roles ADD COLUMN permissions JSONB DEFAULT '{}';

CREATE TABLE IF NOT EXISTS itinerary_items (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER,
    activity_name VARCHAR(200),
    location VARCHAR(200),
    time TIME,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'planned'
);

CREATE TABLE IF NOT EXISTS checklists (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE
);
