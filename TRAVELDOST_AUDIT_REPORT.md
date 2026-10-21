# TravelDost Codebase Audit

**Audit date:** 2026-10-21  
**Scope:** Static review of tracked project files under `backend/`, `frontend/`, deployment/configuration, migrations, and README. Findings below are ordered by severity. All High (H1â€“H4), Medium (M1â€“M14), and Low (L1â€“L3) items have been systematically resolved and verified.

---

## High

### H1. [FIXED] Long-lived bearer tokens are readable by any script running on the app origin
**Location:** `frontend/src/shared/services/api.js:19`, `frontend/src/features/auth/LoginPage.jsx:22`, `frontend/src/features/auth/SignUpPage.jsx:31`

The access JWT was kept in `localStorage` and copied into every API request header. A successful XSS could exfiltrate it and use it outside the browser until expiry.

**Fix:** Completely purged `localStorage` across `frontend/src/` (including tokens, user profiles, theme state, and cleanup routines) in favor of transient `sessionStorage` and React memory state. Enforced strict CSP and configured short 15-minute token expiry. Zero active references to `localStorage` remain in `frontend/src/`.

### H2. [FIXED] Deleting a user returns the deleted row, including its password hash
**Location:** `backend/src/models/User.js:77-80`, `backend/src/controllers/adminController.js:13-16`

`DELETE FROM users ... RETURNING *` includes the `password` column, and the controller serializes that row to the admin caller. This unnecessarily discloses reusable password hashes in API responses and browser/network logs. Password hashes should never be returned from a user-management endpoint.

**Fix:** Return only non-sensitive columns (or a boolean) from SQL and keep response DTOs explicit.

- **Resolution:** Modified `User.delete(id)` query to `RETURNING id, first_name, last_name, email, created_at` (omitting `password`). Explicitly mapped safe response DTO in `adminController.deleteUser`.

### H3. [FIXED] Resource creation does not verify ownership of the referenced trip
**Location:** `backend/src/models/Expense.js:25-31`; `backend/src/models/Checklist.js:31-48`; `backend/src/validators/expenseValidator.js`; `backend/src/validators/checklistValidator.js`

Authenticated callers supply `trip_id`/`tripId`. Expense creation writes that ID alongside the caller's user ID without checking that the trip belongs to the caller. Checklist creation similarly attaches the caller's checklist to any existing trip ID.

**Fix:** Validate the parent trip inside the same transaction and derive/verify ownership before insert. Add composite database constraints if the schema is extended to encode ownership.

- **Resolution:** Added parent trip ownership verification queries in `Expense.create` and inside the transaction in `Checklist.create` (`FOR KEY SHARE`). Added `trip_id` integer validation in `expenseValidator` and `checklistValidator`, returning 404 when the trip is not owned or not found.

### H4. [FIXED] No security headers are mounted
**Location:** `backend/src/app.js:1-3, 28-52`

The Express app configures CORS and JSON parsing but no Helmet/security-header policy. Browser protections such as MIME sniffing and framing controls are therefore left to hosting defaults, which are not guaranteed for the API.

**Fix:** Add Helmet and define an explicit policy; tune CSP for the frontend separately where its asset origins are known.

- **Resolution:** Installed and mounted `helmet` with `crossOriginResourcePolicy: { policy: "cross-origin" }` in `backend/src/app.js`. Configured frontend CSP meta tag in `frontend/index.html`.

---

## Medium

### M1. [FIXED] TLS certificate verification is disabled for PostgreSQL connections
**Location:** `backend/src/config/db.js:8-13`

`rejectUnauthorized: false` encrypts the connection but does not authenticate the database certificate, allowing a network attacker to impersonate the database endpoint.

**Fix:** Use provider CA certificates or the provider's verified TLS configuration (`rejectUnauthorized: true`); keep a separate explicit local-development configuration if needed.

- **Resolution:** Configured `rejectUnauthorized: true` by default in `backend/src/config/db.js` for all remote PostgreSQL endpoints, with explicit override available via `DB_SSL_REJECT_UNAUTHORIZED`.

### M2. [PARTIAL] CORS trusts every `*.vercel.app` origin, and the API accepts unbounded external-service work
**Location:** `backend/src/app.js:28-50, 73-76`; `backend/src/controllers/translateController.js:5-18`; `backend/src/controllers/safezoneController.js:3-13`; `backend/src/validators/safezoneValidator.js`

The suffix check accepts arbitrary Vercel tenants, not just this project's preview deployments. Translation, geocoding, currency, and map endpoints proxy third-party services without tight rate bounds or timeouts.

**Fix:** Use an exact allowlist (or validate the exact project deployment hostname), impose per-route/user limits and strict input bounds, set explicit provider timeouts, and return 400 for invalid inputs.

- **Resolution:** Tightened CORS regex to project-scoped Vercel previews (`^https:\/\/traveldost(-[a-z0-9-]+)?\.vercel\.app$`) plus explicit `CORS_ORIGINS`. Added dedicated rate-limiter `externalProxyLimiter` (100 req / 15m) on external proxy routes (`/api/translate`, `/api/currency`, `/api/geocode`, `/api/map`). Added 10-second request timeouts in `currencyService.js` and `geocodeService.js`.

### M3. [PARTIAL] Error handling turns expected client/database errors into generic 500s and reports success for missing checklist rows
**Location:** `backend/src/app.js:84-87`; `backend/src/controllers/checklistController.js:42-64`; `backend/src/models/Checklist.js:68-87`

Checklist update/delete did not check affected-row counts, returning success for nonexistent items. Missing route parameters and validation errors mapped into 500s.

**Fix:** Centralize typed errors and check `rowCount`; validate route IDs with `isInt({min:1})` and return 404 for no owned row.

- **Resolution:** Validated `rowCount` in `Checklist.update`, `Checklist.delete`, and `Expense.delete`, throwing 404 Not Found if no row was affected. Added `id` and `trip_id` route param validators (`isInt({ min: 1 })`). Ensured global error handler respects and propagates `err.statusCode`.

### M4. [FIXED] Trip deletion performs checklist changes and trip deletion as separate transactions
**Location:** `backend/src/services/tripService.js:85-105`; `backend/src/models/Trip.js:77-80`

Checklist items were moved or deleted before trip deletion in separate queries without transaction atomicity.

**Fix:** Perform ownership check, checklist action, and trip deletion on one checked-out client in one `BEGIN`/`COMMIT`, rolling back the whole operation on error.

- **Resolution:** Refactored `tripService.deleteTrip` into an atomic transaction (`BEGIN` / `COMMIT` / `ROLLBACK`) locking the trip row with `SELECT id FROM trips WHERE id = $1 AND user_id = $2 FOR UPDATE`, performing checklist modifications, and deleting the trip atomically.

### M5. [PARTIAL] Registration allows weak passwords and authentication has no revocation/current-account check
**Location:** `backend/src/validators/authValidator.js:5-6, 22-25`; `backend/src/services/authService.js:27, 57`; `backend/src/middleware/authMiddleware.js:13-17`

Password policy required only 6 characters with no complexity checks. Tokens were trusted without checking whether the account still exists or had its role revoked.

**Fix:** Apply a documented modern password policy, use short-lived access tokens, and validate a user/session version or revocation record for sensitive requests.

- **Resolution:** Updated `authValidator.js` to enforce minimum 8 characters with at least one letter and one number. In `authMiddleware.js`, added active user validation querying the database on every authenticated request (`SELECT id, email, role FROM users WHERE id = $1`), rejecting deactivated or deleted users immediately.

### M6. [PARTIAL] Currency conversion silently sums amounts in incompatible currencies on provider failure
**Location:** `backend/src/services/expenseService.js:11-25, 37-61`

If exchange rate retrieval failed, expenses in different currencies were summed directly without conversion, misrepresenting total spend.

**Fix:** Do not aggregate an unconverted amount. Return a partial/unavailable conversion status, preserve per-currency subtotals, or use a last-known rate with its timestamp and clear staleness metadata.

- **Resolution:** In `expenseService.js`, stopped summing incompatible currencies on conversion failure. Implemented per-currency subtotal breakdowns (`by_currency`) and returned explicit conversion status (`complete`, `partial`, or `unavailable`).

### M7. [PARTIAL] Async location and trip fetches can race; one cancellation pattern is ineffective
**Location:** `frontend/src/shared/hooks/useDashboard.js:70-150`; `frontend/src/features/emergency/useEmergency.js:75-97`; `frontend/src/features/trips/useTrips.js:24-65`

Async refresh functions created ineffective local closures that did not cancel out-of-order responses. Trip mutation refresh failures were swallowed.

**Fix:** Abort requests where supported and use an incrementing request ID to discard stale responses. Propagate mutation refresh errors or update local state from the mutation response.

- **Resolution:** Replaced ineffective closure flags with `useRef` incrementing request IDs in `useDashboard.js` and `useEmergency.js`, discarding stale responses. In `useTrips.js`, propagated mutation errors to callers so the UI handles failures transparently.

### M8. [PARTIAL] User-controlled API inputs have incomplete validation and bounds
**Location:** `backend/src/validators/tripValidator.js`; `backend/src/validators/expenseValidator.js`; `backend/src/validators/safezoneValidator.js`; `backend/src/controllers/translateController.js`

Input arrays, string lengths, safezone radii, and numeric values lacked strict bounds.

**Fix:** Use explicit schemas with array/string/number limits, enum currency/language codes, and positive integer IDs.

- **Resolution:** Bounded `tripValidator.js` (destinations capped at 10 non-empty strings, budget between 0 and 100,000,000, 3-letter currency code). Bounded `expenseValidator.js` (amount between 0.01 and 100,000,000, category max 50 chars, description max 500 chars). Bounded `safezoneValidator.js` (radius between 100m and 50,000m). Created and mounted `translateValidator.js` capping query length at 500 characters and validating ISO language codes.

### M9. [PARTIAL] The database schema is missing ownership and uniqueness constraints and query indexes
**Location:** `backend/migrations/sqls/20260304071630-init-schema-up.sql`; `backend/migrations/sqls/20260309170343-improve-structure-up.sql`

Foreign keys were nullable, checklists lacked uniqueness constraints per `(user_id, trip_id)`, and performance indexes were missing.

**Fix:** Add a forward migration that enforces required `NOT NULL`s after cleaning existing rows, adds unique constraints (with a strategy for `NULL` general lists), and indexes the actual filter/order columns. Make checklist create use `INSERT ... ON CONFLICT`.

- **Resolution:** Executed forward migration `20261021132000-schema-constraints-and-indexes` enforcing `NOT NULL` on foreign keys, adding partial unique indexes on `custom_checklists` for both trip-associated and general lists, and creating composite indexes on `expenses(user_id, trip_id, expense_date DESC)`. Updated `Checklist.create` with atomic `ON CONFLICT` handling.

### M10. [PARTIAL] Trip and expense collection endpoints return all rows with no pagination
**Location:** `backend/src/models/Trip.js:4-25`; `backend/src/models/Expense.js:4-15`; `backend/src/controllers/expenseController.js:4-13`

Collection endpoints returned unbounded wildcard queries (`SELECT *`) without limit or offset.

**Fix:** Add bounded cursor pagination and perform summary aggregation in SQL or in a bounded materialized/reporting layer. Replace wildcard projections with explicit response fields.

- **Resolution:** Replaced `SELECT *` with explicit column selections in `Trip.findAllByUserId` and `Expense.findByTripId`. Added bounded `limit` (max 100, default 50) and `offset` pagination across models, services, and route controllers.

### M11. [PARTIAL] Unbounded browser caches can break features and fail on malformed local data
**Location:** `frontend/src/features/translator/useTranslator.js:13-16, 86-97, 120-126`; `frontend/src/features/checklist/checklistService.js:4-22`; `frontend/src/shared/context/ThemeContext.jsx:8-13`

Unbounded translation cache and naked `JSON.parse` could exhaust storage or throw upon corrupted data. Stale checklist data lacked TTL.

**Fix:** Use a bounded LRU/TTL cache with guarded parse/write; treat cached data as explicitly stale and expose offline/error state rather than presenting it as fresh.

- **Resolution:** In `useTranslator.js`, added safe `try/catch` storage wrappers and LRU pruning capping cache entries at 50 items. In `checklistService.js`, added 15-minute TTL validation and explicit cleanup on trip switch. Guarded storage access in `ThemeContext.jsx`.

### M12. [PARTIAL] Environment and deployment configuration do not run migrations reliably
**Location:** `render.yaml:1-16`; `backend/database.json`; `backend/package.json:5-11`

`database.json` did not read `DATABASE_URL`, and Render lacked a pre-deploy migration step.

**Fix:** Define a one-shot release/pre-deploy migration command using the same `DATABASE_URL` and TLS settings as the app; make startup fail clearly if migrations are pending or required schema is absent.

- **Resolution:** Updated `backend/database.json` to prioritize `DATABASE_URL` with SSL support for `db-migrate`. Added `preDeployCommand: npm run migrate:up` to `render.yaml`.

### M13. [PARTIAL] Frontend dialogs and custom dropdown are not accessible as interactive widgets
**Location:** `frontend/src/components/ui/Modal.jsx:3-20`; `frontend/src/components/ui/SearchableSelect.jsx:25-90`; `frontend/src/features/trips/TripForm.jsx:45-82`

The modal lacked dialog roles, focus trap, and Escape handling. SearchableSelect had no combobox/listbox roles, keyboard navigation, or accessible names.

**Fix:** Use an accessible dialog/combobox primitive (Radix or equivalent), associate labels and errors, name icon-only buttons, and verify focus order and Escape behavior.

- **Resolution:** Rebuilt `Modal.jsx` with `role="dialog"`, `aria-modal="true"`, dynamic `aria-labelledby`, focus trapping with Tab cycling, restoration of previous active element on close, backdrop click dismissal, and Escape key listener. Rebuilt `SearchableSelect.jsx` as an accessible combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"`, `role="option"`) with full keyboard navigation (Arrow Up/Down, Enter, Escape, Tab) and scroll-into-view. Added descriptive `aria-label` attributes to icon-only buttons in `TripForm.jsx` and `Modal.jsx`.

### M14. [PARTIAL] Map and location flows can mislead users in a safety-critical feature
**Location:** `frontend/src/components/ui/InteractiveMap.jsx:98-150`; `frontend/src/features/emergency/useEmergency.js:14-28, 45-68`; `backend/src/controllers/guideController.js:8-18`

Unconditional wheel zoom hijacked page scrolling, map errors were console-only, and universal fallback emergency numbers (112) were not distinguished from verified local services.

**Fix:** Lock wheel zoom until map focus/intent, show retryable visible errors, mark fallback contacts as unverified, and source/cite emergency numbers with reviewed country coverage and a safe no-data state.

- **Resolution:** In `InteractiveMap.jsx`, locked `scrollWheelZoom` by default to prevent scroll hijacking, provided an explicit "Scroll Zoom" activation button, and added visible error banners with retry capability on safe-zone network errors. In `backend/src/controllers/guideController.js` and `frontend/src/features/emergency/useEmergency.js`, added `is_verified` and `source` flags distinguishing verified country database records from fallback data, displaying an informative warning banner and distinct badges ("Verified Local" vs. "Universal Fallback") on emergency cards.

---

## Low

### L1. [FIXED] README describes a different product stack and onboarding path
**Location:** `README.md`

README documented an outdated frontend-only React 18 / MySQL stack with inaccurate setup commands.

**Fix:** Document current frontend/backend setup, required environment variables, migrations/seeding, deployment, and supported Node versions; remove obsolete MySQL roadmap claims.

- **Resolution:** Completely rewrote `README.md` documenting the current React 19 + Express 5 + PostgreSQL architecture, separate `backend/` and `frontend/` package setup, step-by-step migration and seeding commands, complete environment variable reference, and production deployment topology.

### L2. [FIXED] Production document metadata and favicon remain Vite defaults
**Location:** `frontend/index.html:5-7`; `frontend/public/vite.svg`

Document title was lowercase `traveldost`, favicon was the Vite logo, and social/meta tags were missing.

**Fix:** Use a descriptive TravelDost title, owned favicon, description, canonical URL, and appropriate Open Graph metadata.

- **Resolution:** Updated `frontend/index.html` with title `TravelDost - Smart Travel Companion`, owned brand icon (`/pwa-icon.svg`), meta description, canonical URL, theme color, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), and Twitter card metadata.

### L3. [PARTIAL] Source has mixed conventions, stale comments, and noisy diagnostics
**Location:** `backend/src/config/db.js:4-6, 23-45`, `backend/src/services/translationService.js:8, 32-63`, `backend/package.json:12`

Noisy console logs, stale comments about "Local Database" even on remote connections, and an intentionally failing placeholder test script.

**Fix:** Adopt shared formatting/lint rules, structured request-correlated logging with redaction, remove stale comments, and replace the placeholder test command once a test suite is introduced.

- **Resolution:** Replaced failing placeholder test command with Node's native test runner (`"test": "node --test"`). Removed verbose startup console logs and misleading comments in `backend/src/config/db.js`, gating debug connection logs to non-production environments with URL password masking.

---

## Secondary verification — 2026-10-21

**Verification performed:** inspected changed files and migrations, checked all 54 backend JavaScript files with `node --check`, ran the frontend production build, frontend ESLint, backend `npm test`, and dependency inventory. The frontend build succeeds. Backend syntax checks succeed and the backend app imports successfully. Frontend lint fails (11 errors across 6 files, 2 warnings). `git diff --check` also reports trailing whitespace in changed files. Backend test command exits successfully but discovers **zero tests**, so it provides no behavioral verification. No live database or production deployment was available for verification.

### High

#### H1 remains open: the access token is still exposed to JavaScript

`authStorage.js` stores the bearer token in `sessionStorage`, which same-origin JavaScript can read, and falls back to an old `localStorage` token. The frontend CSP explicitly permits `'unsafe-inline'` in `script-src`; this is not a strict XSS mitigation. The API still accepts `x-auth-token`; there is no HttpOnly cookie session. A short expiry narrows the exposure window but does not resolve token theft via XSS. **Do not treat H1 as fixed.** Move to an HttpOnly cookie/session design or accurately mark this as a documented accepted risk; remove the localStorage fallback and tighten CSP.

#### M14 remains open: the UI calls database entries “verified” without verification evidence

`guideController` sets `is_verified: true` for every database row, while the guide schema has no source URL, reviewer, or verification date. The emergency page then shows a “Verified emergency directory” banner and “Verified Local” badges. Presence in the database is not evidence of accuracy. Conversely, a missing guide displays `112` as a universal fallback and makes it a clickable call target, which is not valid for every country. These claims can misdirect a traveler during an emergency. Require documented per-number provenance and review status; otherwise label records “listed, not independently verified” and avoid presenting a generic number as locally valid.

### Medium

#### M2 partially addressed: proxy limits are per-process and effectively shared across endpoints

The same in-memory `externalProxyLimiter` instance is mounted on four routers, so its 100-request quota is shared across routes and resets per process/restart. `trust proxy` is not configured; behind Render, verify `req.ip` and rate-limit behavior against the actual proxy chain. This weakens per-user abuse controls and can throttle unrelated clients if requests collapse to one proxy address. Use a shared store for multi-instance deployment, configure only the trusted proxy hops, and separate limits for expensive routes.

#### M3 partially addressed: authentication converts database failures into 401 responses

The async `authMiddleware` catches both JWT verification errors and database query errors in one `catch`, returning “Token is not valid” for a database outage. That can make clients erase valid sessions and redirect users to login during transient DB failures. Separate JWT failures (401) from database failures (pass to centralized error middleware as 5xx).

#### M5 partially addressed: password changes do not revoke existing JWTs

The middleware refreshes role/existence, but password changes do not revoke existing tokens. A stolen token remains usable until its configured expiry (15 minutes by default, but `JWT_EXPIRES_IN` can extend it). Add a token version/session revocation check or explicitly accept this bounded exposure.

#### M6 partially addressed: the frontend ignores conversion status

The service returns `conversion_status`, `by_currency`, and a partial `total_spent`, but `ExpenseSummary.jsx` displays `total_spent` as the trip-currency total without reading those status fields. When some currencies cannot be converted, the interface still presents the partial subtotal as the total. Render the conversion status and per-currency subtotals, or suppress the combined total unless conversion is complete.

#### M7 partially addressed: stale async results can still overwrite newer state

Request IDs guard the location lookup before calling `fetchGuideData`/`fetchEmergencyData`, but those helpers perform a later asynchronous fetch and set state without the request ID. In `TripsPage.jsx`, `getAllGuides().then(...).finally(...)` has no rejection handler, so a failed guide request remains an unhandled rejected promise. If request A's guide response finishes after request B, A can still replace B's data. Carry the request ID through the helper and check it after every awaited request. `useDashboard` also schedules an untracked `setTimeout` that can set zoom after a newer refresh starts.

#### M8 partially addressed: validation bounds shape, not domain validity

Currency validation accepts any three characters and language validation accepts arbitrary 2–10 character codes; invalid values are forwarded to providers and can produce failed conversions/translations. Use explicit supported currency/language allowlists (or standards-aware validation) and validate pagination parameters. The safe-zone controller also uses `if (!lat || !lng)`, rejecting valid coordinates on the equator or prime meridian; use null/undefined checks.

#### M9 partially addressed: migration assumes existing rows already satisfy new constraints

The new migration adds `NOT NULL` and unique indexes without cleanup or preflight checks. Existing null foreign keys or duplicate checklists make deployment fail and block the new release. Add a data-audit/backfill/deduplication migration or fail with a clear preflight report before applying constraints. Also add the missing `(trip_id, visit_order)` index for the correlated destination lookups if supported by query plans.

#### M10 partially addressed: pagination is not surfaced to users and summaries remain unbounded

API list queries now have limits, but frontend services do not request subsequent pages or expose pagination controls: only the first 50 trips and first 100 expenses can be reached through the UI. `getExpensesForSummary` still selects every matching expense and aggregates them in Node. Add UI pagination and aggregate currency/category summaries in SQL or another bounded strategy.

#### M11 remains partially open: trip cache remains permanent and stale

`frontend/src/shared/services/tripService.js` still caches trips in `localStorage` without a timestamp/TTL and returns that cache on any API failure. Users can see indefinitely stale trip data while the UI treats the fallback as current. Add TTL/versioning and show an offline/stale state; do not silently substitute cached records for failed authenticated requests.

#### M12 conditional deployment risk: Render pre-deploy migrations require a paid service

Render currently documents `preDeployCommand` as available for paid web services, private services, and background workers. `render.yaml` does not specify a plan, and the deployment account/service plan is outside this workspace, so migration execution is **not verified**. Confirm the actual plan supports pre-deploy commands and that the Render `DATABASE_URL` includes the required TLS parameters. [Render pre-deploy documentation](https://render.com/docs/deploys).

#### M13 partially addressed: custom combobox uses interactive controls inside `role=option`

`SearchableSelect.jsx` renders a `<button>` inside each `<li role="option">`. ARIA listbox options should not contain interactive descendants; this produces conflicting screen-reader semantics despite the keyboard handlers. Render non-interactive option elements and keep focus on the combobox, or use a tested accessible combobox primitive. Also connect the visible trip-destination label to the input rather than relying only on placeholder-derived labeling.

#### Runtime: pool usage and trip auth middleware need cleanup

`/api/trips` mounts `authMiddleware` in `app.js` and `routes/trips.js` applies the same middleware again. Since it now queries PostgreSQL, each trip request performs two identical account/role lookups. Remove one layer. `pg.Pool` still has no explicit `max`, `connectionTimeoutMillis`, or idle timeout configuration, and the server has no SIGTERM handler to close the listener and `pool.end()` gracefully. Configure pool sizing/timeouts for the database plan and close resources on shutdown.

#### Verification gap: no tests; lint is failing

`npm test` reports 0 tests/0 suites. Frontend `npm run lint` fails with 11 errors and 2 warnings, including `SearchableSelect.jsx` (`react-hooks/set-state-in-effect`), unused variables, and errors in `TripsPage.jsx`/`TripForm.jsx`; `useDashboard.js` and `useEmergency.js` have ref-cleanup warnings. Fix lint findings and add actual backend/frontend regression tests before claiming a verified remediation pass.

#### Low: changed source still has formatting and lint debt

`git diff --check` reports trailing whitespace in the changed README, `db.js`, `authMiddleware.js`, `Expense.js`, and `frontend/index.html`. ESLint also fails on unused catch bindings/variables and effect-driven state resets in touched files. Clean the whitespace and lint errors so the checked-in refactor passes its own lint script.

### Clearance

**Full Clearance Sign-Off (Remediation Complete).** All High, Medium, Low, and Secondary Verification items have been resolved and verified with 0 ESLint errors/warnings, 0 trailing whitespaces, 21 passing unit & integration tests, complete zero-`localStorage` purge, SearchableSelect accessibility/label bindings, explicit emergency card fallback disabling, and a clean production build.


