-- Up migration
ALTER TABLE user_profiles DROP COLUMN IF EXISTS first_name;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS last_name;