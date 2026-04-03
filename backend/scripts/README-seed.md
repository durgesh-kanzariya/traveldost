# Country Guides Data Import

This script imports the `uncommon_rules_by_country.json` data into the `country_guides` table in your PostgreSQL database.

---

## What It Does

- **Inserts** new country entries if they don't exist in `country_guides`
- **Updates** existing placeholder entries with detailed uncommon rules
- **Preserves** emergency contact numbers (police, ambulance, fire, embassy) - these are NOT overwritten
- **Formats** rules with category prefixes: `[Etiquette] Never tip waitstaff...`

---

## Data Source

`uncommon_rules_by_country.json` (in project root)
- 111 countries
- 1,110+ rules across categories: Etiquette, Social, Legal, Business, Dining, Environmental
- Each rule is a string with a category classification

---

## Target Table

**`country_guides`** (PostgreSQL)

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer | PK, auto-increment |
| `country_name` | varchar | **UNIQUE** - matches JSON country name |
| `police_number` | varchar | Emergency contact (preserved/unchanged) |
| `ambulance_number` | varchar | Emergency contact (preserved/unchanged) |
| `fire_number` | varchar | Emergency contact (preserved/unchanged) |
| `embassy_number` | varchar | Emergency contact (preserved/unchanged) |
| `local_rules` | varchar[] | **Updated** - array of formatted rule strings |
| `created_at` | timestamp | Auto-set on insert |
| `updated_at` | timestamp | (optional) can be updated manually |

---

## Prerequisites

1. ✓ PostgreSQL running (local or Neon)
2. ✓ Database created (default: `traveldost_local`)
3. ✓ Migrations applied (table structure exists)
4. ✓ `.env` file configured in `backend/` with DB credentials
5. ✓ `uncommon_rules_by_country.json` exists in project root

---

## How to Run

### Option 1: Direct Node Execution (Recommended)

```bash
cd backend
node scripts/seed-country-guides.js
```

### Option 2: Using npm script (after adding to package.json)

Add to `backend/package.json`:

```json
{
  "scripts": {
    "seed:guides": "node scripts/seed-country-guides.js"
  }
}
```

Then run:

```bash
cd backend
npm run seed:guides
```

---

## Expected Output

```
📖 Loading rules from: uncommon_rules_by_country.json
✅ Loaded 111 countries with 1110 rules

🚀 Starting import...

  ➕ Inserted: Japan (10 rules)
  ✏️  Updated: India (12 rules)
  ...

✅ Import Complete!
   Inserted: 45 new countries
   Updated:  66 existing countries
   Total countries with detailed rules: 111
```

---

## Verification

After running, verify the data:

```bash
# Connect to your database
psql -d traveldost_local

# Inside psql:
SELECT country_name, array_length(local_rules, 1) as rule_count
FROM country_guides
WHERE local_rules IS NOT NULL
ORDER BY rule_count DESC
LIMIT 10;
```

Or via API (once backend is running):

```bash
curl http://localhost:5000/api/guides/country/Japan
```

---

## Rollback (If Needed)

If you need to revert to the placeholder data (single "Respect local laws" rule), you can:

```sql
-- Option A: Truncate and re-run with only JSON countries
DELETE FROM country_guides WHERE country_name IN (
  SELECT country_name FROM country_guides
  WHERE local_rules && ARRAY[['%']]  -- any non-empty array condition
  AND array_length(local_rules, 1) > 1
);

-- Option B: Restore from backup (if you made one)
-- pg_dump -t country_guides backup.sql
-- psql -d yourdb -f backup.sql
```

The script is **idempotent** - you can run it multiple times safely. It will only update `local_rules` and won't modify emergency numbers.

---

## Integration with Frontend

The `country_guides` data is typically fetched via the `guideService.js`:

```javascript
import { getCountryGuide } from '@/services/guideService';

// Usage in a component:
const { data: guide } = useQuery(['countryGuide', countryName], () =>
  getCountryGuide(countryName)
);
```

The `local_rules` array will now contain detailed rules like:
```json
[
  "[Etiquette] Never tip waitstaff - it's considered insulting...",
  "[Social] Bow instead of shaking hands - the depth and duration...",
  ...
]
```

You can display them grouped by category by parsing the prefix, or show as a flat list.

---

## Emergency Numbers Missing?

The JSON file only contains **cultural rules**, not emergency numbers. The placeholder data currently has generic values like:

```
police_number: "119"
ambulance_number: "112"
fire_number: "119"
embassy_number: "Check Local"
```

These are **not accurate** for most countries. To populate real emergency numbers:

1. Find a reliable dataset (government sources, travel websites)
2. Create a similar seed script or update manually via:
   ```sql
   UPDATE country_guides
   SET police_number = '911',
       ambulance_number = '911',
       fire_number = '911'
   WHERE country_name = 'United States';
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Error: database "traveldost_local" does not exist` | Create DB: `createdb traveldost_local` then run migrations |
| `permission denied for relation country_guides` | Ensure user has access. Check DB owner. |
| `could not find uncommon_rules_by_country.json` | File must be in project root (same level as `backend/`, `frontend/`) |
| `duplicate key value violates unique constraint` | This should not happen with UPSERT. Ensure `country_name` matches exactly. |
| No rules appear after import | Query with `WHERE local_rules IS NOT NULL` - check that rules aren't empty arrays |

---

## Next Steps

After import:
1. Test the Emergency page in the app to see the new rules
2. Consider categorizing rules in the UI (group by category from `[Category]` prefix)
3. Add pagination or search if rules list is long (some countries have 30+ rules)
4. Plan for updating rules periodically (JSON file has `last_updated` metadata)

---

**Questions?** See `CODE_MAP.md` and `docs/architecture.md` for project structure.
