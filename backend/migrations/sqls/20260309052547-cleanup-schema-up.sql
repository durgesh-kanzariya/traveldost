-- Up migration
DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS checklists;
ALTER TABLE roles DROP COLUMN IF EXISTS permissions;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE destinations DROP COLUMN IF EXISTS latitude;
ALTER TABLE destinations DROP COLUMN IF EXISTS longitude;
ALTER TABLE trip_destinations DROP COLUMN IF EXISTS arrival_date;
ALTER TABLE trip_destinations DROP COLUMN IF EXISTS departure_date;
