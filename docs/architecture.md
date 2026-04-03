# TravelDost Architecture Documentation

**Last Updated**: March 24, 2026
**Project Type**: Full-Stack Travel Safety App (React + Express + PostgreSQL)
**Deployment**: Render.com (configured)

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Flow](#data-flow)
5. [Authentication & Authorization](#authentication--authorization)
6. [Database Schema](#database-schema)
7. [Key Configuration](#key-configuration)
8. [Development Workflow](#development-workflow)

---

## System Overview

TravelDost is a location-aware travel safety application that:
- Detects user location automatically
- Displays emergency numbers, local rules, and language tools
- Allows users to plan trips, track expenses, and manage checklists
- Supports admin users for content management

**Tech Stack**:
- **Frontend**: React 19 + Vite + Tailwind CSS 4 + React Router v7
- **Backend**: Express.js 5 + PostgreSQL 17 (Neon Serverless)
- **Auth**: JWT tokens (stored in localStorage)
- **Maps**: Leaflet + React Leaflet
- **External APIs**: BigDataCloud (reverse geocoding)

---

## Frontend Architecture

### 1. Application Entry Point

**`src/main.jsx`**
```javascript
ThemeProvider → App
```
- Wraps entire app in `ThemeProvider` (dark/light mode via Context)
- Renders into `#root`

### 2. Routing (`src/App.jsx`)

**Public Routes** (no auth required):
- `/` - Landing page with sections (Hero, Features, How It Works, Contact)
- `/login` - LoginPage
- `/signup` - SignUpPage

**Protected Routes** (authenticated users):
- `/dashboard` - Dashboard
- `/trips` - TripsPage (trip management)
- `/expenses` - ExpenseTrackerPage
- `/checklist` - ChecklistPage
- `/translator` - TranslatorPage
- `/currency-converter` - CurrencyConverterPage
- `/emergency` - EmergencyPage
- `/settings` - SettingsPage

**Admin Routes** (requires admin role):
- `/admin/dashboard` - AdminDashboard
- `/admin/users` - UserManagement
- `/admin/guides` - ManageGuides

**Error Handling**:
- `AdminErrorBoundary` wraps admin routes (catches React errors)
- `ProtectedRoute` redirects to `/login` if no token
- `AdminRoute` checks `user.role === 'admin'`

**Lazy Loading**: All pages use `React.lazy()` + `Suspense` for code splitting.

### 3. Component Organization

```
frontend/src/components/
├── auth/          (3 files)   - Route guards: ProtectedRoute, AdminRoute, AdminErrorBoundary
├── layout/        (6 files)   - Navbar, Footer, DashboardLayout, AdminLayout, Breadcrumbs, BackToTop
├── sections/      (4 files)   - Landing page sections: Hero, Features, HowItWorks, Contact
├── trips/         (4 files)   - TripCard, TripForm, TripSelector, DeleteTripModal
├── expenses/      (3 files)   - ExpenseForm, ExpenseList, ExpenseSummary
├── guides/        (1 file)    - GuideFormModal (admin)
├── ui/            (5 files)   - Reusable UI: Modal, LoadingSpinner, Skeleton, SearchableSelect, InteractiveMap
└── [index.js per folder] - Barrel exports for clean imports
```

**Total**: 26 component files (excluding barrel `index.js`)

**Layout Components**:
- `DashboardLayout`: Main authenticated layout with sidebar navigation, theme toggle, logout
- `AdminLayout`: Admin-specific layout (similar structure)
- `Navbar`: Top navigation (visible on landing page)
- `Footer`: Site footer with links

### 4. Page Components

Located in `src/pages/` (12 pages + 1 NotFound):
- Most pages are **route containers** that compose hooks and components
- Examples:
  - `TripsPage.jsx`: Uses `useTrips()` hook, renders `TripCard`, `TripForm`, etc.
  - `Dashboard.jsx`: Uses `useDashboard()` for stats and upcoming trips
  - `SettingsPage.jsx`: Allows users to set native language, default currency

**Admin Pages** in `src/pages/admin/`:
- `AdminDashboard.jsx`: Admin stats and overview
- `UserManagement.jsx`: User list with role assignment
- `ManageGuides.jsx`: CRUD for country guides (emergency numbers + rules)

### 5. Service Layer

Located in `src/services/` (10 service modules):

| Service | Purpose | API Endpoints |
|---------|---------|---------------|
| `api.js` | Axios instance with interceptors | Base URL: `/api` |
| `authService.js` | User auth flows | `/auth/register`, `/auth/login`, `/auth/profile`, `/auth/password` |
| `tripService.js` | Trip CRUD + caching | `/trips`, `/trips/upcoming`, `/trips/:id/checklist-count` |
| `expenseService.js` | Expense management | `/expenses` |
| `checklistService.js` | Checklist operations | `/checklist` |
| `guideService.js` | Admin guide management | `/guides` |
| `adminService.js` | Admin user management | `/admin/*` |
| `locationService.js` | Geolocation + reverse geocoding | BigDataCloud API |
| `translationService.js` | Language translation | `/translate` |
| `index.js` | Barrel export |

**Key Pattern**: Services wrap the centralized `api` instance and handle:
- LocalStorage caching (e.g., `tripService` caches trips)
- Error message normalization
- Data transformation when needed

**Interceptor Magic** (`api.js`):
- **Request**: Auto-adds `x-auth-token` from localStorage
- **Response**: 401 → auto-redirect to `/login` (clears token)

### 6. Custom Hooks

Located in `src/hooks/` (8 hooks):

| Hook | Purpose | Dependencies |
|------|---------|--------------|
| `useAuth.js` | Logout, getUser, getToken, isAdmin | localStorage, useNavigate |
| `useTrips.js` | Fetch trips, create, update, delete | tripService |
| `useExpenses.js` | Expense CRUD, category aggregation | expenseService |
| `useEmergency.js` | Fetch emergency contacts by country | - (likely direct API) |
| `useLocation.js` | Geolocation, caching (24h), reverse geocode | locationService |
| `useTranslator.js` | Translation with language pair, history | translationService |
| `useCurrency.js` | Currency conversion | - |
| `useDashboard.js` | Dashboard stats (trips count, expenses, upcoming) | multiple services |

**Pattern**: Hooks encapsulate business logic and state for UI components. They compose service calls and manage local loading/error states.

### 7. Context API

**`ThemeContext.jsx`**:
- State: `theme` = 'light' | 'dark' | 'system' (persisted in localStorage)
- Methods: `setTheme`, `toggleTheme`
- Effect: Adds/removes `light`/`dark` classes on `document.documentElement`
- Wraps entire app in `main.jsx`

### 8. Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **No `tailwind.config.js`** - v4 uses CSS-first configuration
- Global styles in `src/assets/styles/index.css` (imports Tailwind + custom CSS)
- Dark mode: `dark:` variants on elements

---

## Backend Architecture

### 1. Entry Point

**`server.js`**:
- Loads `.env` with `dotenv`
- Calls `createApp()` from `app.js`
- Starts server on `PORT` (default 5000)
- Global error handlers: `uncaughtException`, `unhandledRejection`

### 2. Application Factory

**`src/app.js`** (`createApp`):
```javascript
Middleware Stack:
├── Rate Limiter (500 req/15min)
├── CORS (localhost, *.vercel.app, production domain)
├── express.json() body parser
├── Routes mounted at /api/*
└── 404 + error handlers
```

**Mounted Routes**:
- `/api/auth` → `auth.js` (no auth middleware)
- `/api/trips` → `trips.js` + `authMiddleware`
- `/api/expenses` → `expenses.js` + `authMiddleware`
- `/api/checklist` → `checklist.js` + `authMiddleware`
- `/api/admin/*` → `adminRoutes.js` + `authMiddleware`
- `/api/guides` → `guideRoutes.js` + `authMiddleware`
- Others: translate, currency, geocode, safezones (public)

### 3. Routes & Controllers

**Pattern**: Express Router + Request Handlers

Each route file defines endpoints and maps to controller functions:
```javascript
// Example: trips.js
router.get('/', authMiddleware, tripController.getUserTrips);
router.post('/', authMiddleware, tripController.createTrip);
router.get('/upcoming', authMiddleware, tripController.getUpcomingTrip);
router.delete('/:id', authMiddleware, tripController.deleteTrip);
router.put('/:id', authMiddleware, tripController.updateTrip);
```

**Controllers** (`src/controllers/`):
- Extract request parameters/body
- Call model/service functions
- Return JSON responses
- Handle errors (try/catch or promise rejections)
- Often use `express-validator` for validation (check validators/)

**Models** (`src/models/`):
- Currently thin wrappers around SQL queries using `pg` driver
- Tables: User, Trip, Expense, Checklist, Destination, CountryGuide
- Provide CRUD functions used by controllers

**Services** (`src/services/`):
- Business logic layer (may duplicate models)
- Could consolidate model and service layers later

**Validators** (`src/validators/`):
- `express-validator` schemas for request validation
- Currently may be minimally used

### 4. Middleware

- **`authMiddleware.js`**: Verifies `x-auth-token` header with JWT, adds `req.user`
- **`adminMiddleware.js`**: (likely) checks `req.user.role === 'admin'`
- **`validationMiddleware.js`**: Runs express-validator checks

### 5. Database Access

**Config**: `src/config/db.js` (not seen, but standard `pg.Pool`)
- Connection pool from `process.env.DB_*` variables
- Used in models and directly in routes (e.g., `/db-test`)

**Migrations**: `backend/migrations/` with `db-migrate` tool
- Currently 4 migrations (schema evolution)
- SQL files in `migrations/sqls/`

---

## Data Flow

### User Registration Flow

1. Frontend: `authService.registerUser(userData)` → POST `/api/auth/register`
2. Backend:
   - `authController.register()` validates input
   - `UserModel.create()` inserts into `users` table
   - Hash password with `bcryptjs`
   - Create `user_profiles` record (defaults: language='English', currency='INR')
   - Return user object (without password) + JWT token
3. Frontend: Stores `token` and `user` in localStorage
4. Frontend: Redirects to `/dashboard`

### Location Detection Flow

1. Component mounts → `useLocation()` hook
2. Calls `locationService.detectAndCacheLocation()`
3. Browser geolocation API → gets lat/lng
4. BigDataCloud reverse geocode API → `{ country, city, lat, lng }`
5. Cached in localStorage (`traveldost_user_location`) for 24 hours
6. App uses this to fetch country-specific data (emergency numbers, rules)

### Trip Management Flow

1. User visits `/trips` → `TripsPage` → `useTrips()` → `tripService.getTrips()`
2. Service checks cache, fetches from `/api/trips` (with auth token)
3. Backend `tripController.getUserTrips()` queries `trips` where `user_id = req.user.id`
4. Renders `TripCard` components for each trip
5. Click "Add Trip" → `TripForm` → `createTrip()` → POST `/api/trips`
6. After creation, cache invalidated

### Expense Tracking Flow

1. On `ExpenseTrackerPage`, select trip → fetch trip's expenses
2. `expenseService.getExpenses(tripId)` → GET `/api/expenses?trip_id=X`
3. Backend filters `expenses` table by `trip_id` and `user_id` (owner check)
4. `ExpenseForm` submit → POST `/api/expenses` with amount, category, description
5. `ExpenseSummary` aggregates expenses by category (computed in frontend)

### Checklist Flow

1. `ChecklistPage` loads `custom_checklists` for current user
2. Renders `checklist_items` for each checklist with `is_checked` toggle
3. Updates sent to `/api/checklist` endpoints

---

## Authentication & Authorization

### JWT Flow

1. User logs in with email/password
2. Backend verifies credentials against `users` table (bcrypt compare)
3. Generates JWT payload: `{ id, email, role }` (from `user_roles` join)
4. Token sent in response; frontend stores in `localStorage` as `'token'`
5. All authenticated requests include `x-auth-token` header (axios interceptor)
6. `authMiddleware` verifies token on protected routes

### Role-Based Access

- **Regular User**: `role_name = 'user'` in `roles` table
- **Admin**: `role_name = 'admin'` in `roles` table
- Many-to-many via `user_roles` join table (supports future multi-role)

**Frontend check**: `useAuth().isAdmin()` reads user from localStorage
**Backend check**: `adminMiddleware` (assumes `req.user.role` from JWT payload)

---

## Database Schema

### 12 Tables (see CLAUDE.md for full schema)

**Core Tables**:
- `users` - Authentication (email + hashed password)
- `roles` + `user_roles` - Role assignment
- `user_profiles` - Preferences (language, currency)

**Travel Data**:
- `trips` - Main trip records
- `destinations` - Lookup: cities/countries
- `trip_destinations` - Many-to-many: trips ↔ destinations (with visit order)
- `expenses` - Transaction records linked to trips

**Content**:
- `country_guides` - Emergency numbers, local rules (array)
- `custom_checklists` + `checklist_items` - User checklists

**System**:
- `migrations` - Migration history

**Size**: ~400 KB total (early stage)

---

## Key Configuration

### Frontend `.env` (frontend/.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend `.env` (backend/.env)
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=traveldost_local
```

### Render.com Deployment

`render.yaml` configures:
- Backend: Node service, start command `node src/server.js`
- Frontend: Static site (build → `dist/`)
- Environment variables set in dashboard

---

## Development Workflow

### 1. Setup (First Time)
```bash
# 1. Clone + install deps
cd backend && npm install
cd ../frontend && npm install

# 2. Create PostgreSQL database: traveldost_local

# 3. Configure .env files (see above)

# 4. Run migrations
cd backend && npx db-migrate up

# 5. Start dev servers (two terminals)
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

### 2. Database Migrations

```bash
cd backend
# Create new migration
npm run migrate:create add-new-feature

# Edit the generated JS file in migrations/ and sqls/ subfolder

# Apply
npm run migrate:up

# Rollback last
npm run migrate:down
```

### 3. Adding a New Feature

**Example: Adding "Travel Insurance" feature**

1. **Backend**:
   - Update DB: create migration adding `insurance_provider` column to `trips`
   - Add routes in `trips.js` or new `insurance.js`
   - Add controller methods in `tripController.js` or new file
   - Add model methods if needed

2. **Frontend**:
   - Add service methods in `tripService.js`
   - Add UI in `TripForm.jsx` or create `InsuranceSection.jsx`
   - Add route if new page (update `App.jsx`)

3. **Test locally**:
   - Frontend: `npm run dev` (hot reload on port 5173)
   - Backend: `npm run dev` (nodemon on port 5000)

---

## Common Tasks Reference

### Where to Find X?

| Task | Location |
|------|----------|
| Change API endpoint | `frontend/src/services/*.js` |
| Add new API route | `backend/src/routes/` + `backend/src/controllers/` |
| Modify database | Create migration in `backend/migrations/` |
| Change styling | `frontend/src/assets/styles/index.css` or inline Tailwind classes |
| Add a page | Create in `frontend/src/pages/`, register in `App.jsx` (lazy load) |
| Add a component | Create in appropriate `components/` subfolder, add barrel export |
| Add environment variable | Frontend: `VITE_*`; Backend: `.env` (use `process.env`) |
| Debug auth issues | Check `localStorage.token`, verify `x-auth-token` header in Network tab |
| See all routes | Check `backend/src/app.js` (mounted routes) |
| Understand data model | See `CLAUDE.md` or `docs/database_schema.md` |

---

## Notes & Gotchas

- **Currency**: Default is `INR` throughout the app. Change in `user_profiles.default_currency`
- **LocalStorage Cache**: Services use cache with invalidation (e.g., `tripService` clears on create/update/delete)
- **Location Cache**: 24 hours in `locationService` (key: `traveltod_usesr_location`)
- **Theme**: Stored in localStorage (`theme`) and applied to `<html>` element
- **CORS**: Localhost allowed; production uses vercel.app and specific domain
- **Rate Limiting**: 500 requests per 15 minutes (global)
- **Array Types**: PostgreSQL arrays used for `country_guides.local_rules`

---

## File Count Summary

| Category | Count |
|----------|-------|
| Frontend pages (`.jsx`) | 13 |
| Frontend components (`.jsx`) | 26 |
| Frontend services (`.js`) | 10 |
| Frontend hooks (`.js`) | 8 |
| Backend routes (`.js`) | 10 |
| Backend controllers (`.js`) | 10 |
| Backend models (`.js`) | 6 |
| Backend services (`.js`) | 9 |
| Backend middleware (`.js`) | 3 |
| Database tables | 12 |

---

**Next Steps**: Read `CODE_MAP.md` for quick feature-based navigation.
