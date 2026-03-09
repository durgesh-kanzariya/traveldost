/* Replace with SQL commands */
-- Up migration
-- 1. Add first_name and last_name to users
ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN last_name VARCHAR(50);

-- Migrate existing names
UPDATE users SET 
    first_name = split_part(name, ' ', 1),
    last_name = SUBSTRING(name FROM POSITION(' ' IN name) + 1)
WHERE name LIKE '% %';

UPDATE users SET 
    first_name = name,
    last_name = ''
WHERE name NOT LIKE '% %';

ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users DROP COLUMN name;

-- 2. Modify destinations table
ALTER TABLE destinations RENAME COLUMN city_name TO location_name;
ALTER TABLE destinations ADD COLUMN location_type VARCHAR(20) DEFAULT 'city';

-- 3. Modify custom_checklists table (drop unused list_title)
ALTER TABLE custom_checklists DROP COLUMN IF EXISTS list_title;

-- 4. Add Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_checklist_id ON checklist_items(checklist_id);