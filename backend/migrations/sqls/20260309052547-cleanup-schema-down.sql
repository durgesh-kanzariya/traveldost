-- Down migration
ALTER TABLE trip_destinations ADD COLUMN departure_date DATE;
ALTER TABLE trip_destinations ADD COLUMN arrival_date DATE;
ALTER TABLE destinations ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE destinations ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;

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
