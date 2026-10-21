-- Up migration: M9 schema constraints, NOT NULLs, and performance indexes

-- 1. Enforce NOT NULL constraints on essential foreign keys and columns
ALTER TABLE trips ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE trip_destinations ALTER COLUMN trip_id SET NOT NULL;
ALTER TABLE trip_destinations ALTER COLUMN destination_id SET NOT NULL;
ALTER TABLE custom_checklists ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE checklist_items ALTER COLUMN checklist_id SET NOT NULL;
ALTER TABLE checklist_items ALTER COLUMN item_name SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN trip_id SET NOT NULL;

-- 2. Partial unique indexes ensuring exactly one checklist per (user_id, trip_id) and one general checklist per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_checklists_user_general 
ON custom_checklists(user_id) WHERE trip_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_checklists_user_trip 
ON custom_checklists(user_id, trip_id) WHERE trip_id IS NOT NULL;

-- 3. Composite query and ordering indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_trip_date 
ON expenses(user_id, trip_id, expense_date DESC);

CREATE INDEX IF NOT EXISTS idx_checklist_items_order 
ON checklist_items(checklist_id, id ASC);
