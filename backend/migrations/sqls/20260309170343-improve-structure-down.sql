/* Replace with SQL commands */
-- Down migration
-- 4. Drop indexes
DROP INDEX IF EXISTS idx_trips_user_id;
DROP INDEX IF EXISTS idx_expenses_trip_id;
DROP INDEX IF EXISTS idx_checklist_items_checklist_id;

-- 3. Restore list_title
ALTER TABLE custom_checklists ADD COLUMN list_title VARCHAR(150) DEFAULT 'My Default Checklist';
UPDATE custom_checklists SET list_title = 'My Default Checklist';
ALTER TABLE custom_checklists ALTER COLUMN list_title SET NOT NULL;

-- 2. Restore destinations
ALTER TABLE destinations DROP COLUMN location_type;
ALTER TABLE destinations RENAME COLUMN location_name TO city_name;

-- 1. Restore name
ALTER TABLE users ADD COLUMN name VARCHAR(100);
UPDATE users SET name = TRIM(first_name || ' ' || COALESCE(last_name, ''));
ALTER TABLE users ALTER COLUMN name SET NOT NULL;
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;