-- Down migration: rollback schema constraints and indexes

DROP INDEX IF EXISTS idx_checklist_items_order;
DROP INDEX IF EXISTS idx_expenses_user_trip_date;
DROP INDEX IF EXISTS idx_custom_checklists_user_trip;
DROP INDEX IF EXISTS idx_custom_checklists_user_general;

ALTER TABLE expenses ALTER COLUMN trip_id DROP NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE checklist_items ALTER COLUMN item_name DROP NOT NULL;
ALTER TABLE checklist_items ALTER COLUMN checklist_id DROP NOT NULL;
ALTER TABLE custom_checklists ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE trip_destinations ALTER COLUMN destination_id DROP NOT NULL;
ALTER TABLE trip_destinations ALTER COLUMN trip_id DROP NOT NULL;
ALTER TABLE trips ALTER COLUMN user_id DROP NOT NULL;
