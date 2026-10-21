# 🌍 TravelDost - Smart Travel Companion

> **Explore the World Without Fear.**
> A location-intelligent full-stack web application that keeps travelers safe and informed by providing instant emergency numbers, regional rules, trip planning, expense tracking, and language tools based on their real-time location.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge)

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Database Migrations & Seeding](#database-migrations--seeding)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Production Deployment](#-production-deployment)
- [Contact](#-contact)

---

## 💡 About the Project

**TravelDost** solves a critical problem for travelers: **uncertainty and safety vulnerabilities in unfamiliar destinations.**

Instead of scrambling to search Google for "police number in [Country]" or searching fragmented blogs for local laws, TravelDost automatically detects where the user is and instantly configures:
1. **Emergency SOS & Safe Zones:** One-tap calling to local verified Police, Ambulance, and Fire services, with a visual Leaflet safe zones map and fallback flags.
2. **Local Customs & Uncommon Rules:** Curated regional regulations and cultural "Do's and Don'ts" to prevent legal trouble and cultural offenses.
3. **Trip & Checklist Planner:** Complete trip itineraries with automatic destination packing checklists and multi-stop planning.
4. **Multi-Currency Expense Tracker:** Real-time multi-currency expense ledger with currency conversion and offline-safe breakdowns.
5. **Language & Utility Hub:** On-the-fly phrase translations and currency exchange tools.

---

## 🛠 Architecture & Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **State & Routing:** React Router v7
- **Maps:** Leaflet & React-Leaflet
- **Icons:** Lucide React
- **PWA:** Vite Plugin PWA (offline asset caching)

### Backend
- **Runtime:** Node.js (v18+ / v20+ recommended)
- **Framework:** Express 5
- **Database:** PostgreSQL 14+ (hosted on Neon or local PostgreSQL)
- **Migrations:** `db-migrate` with `db-migrate-pg`
- **Security:** Helmet, CORS origin whitelisting, Bcrypt password hashing, short-lived JWT authentication, and Express Rate Limiting.

---

## 📁 Repository Structure

```
traveldost/
├── backend/
│   ├── database.json        # db-migrate connection config
│   ├── migrations/          # PostgreSQL database migrations
│   ├── scripts/             # Database initialization and guides seeding
│   ├── src/
│   │   ├── config/          # Database pool & TLS connection
│   │   ├── controllers/     # Route business controllers
│   │   ├── middleware/      # Auth, admin, validation & rate limiters
│   │   ├── models/          # PostgreSQL data access models
│   │   ├── routes/          # Express API route modules
│   │   ├── services/        # Geocoding, exchange rates, translation
│   │   └── server.js        # Server entrypoint
│   └── package.json
├── frontend/
│   ├── public/              # Static assets and PWA icons
│   ├── src/
│   │   ├── components/      # UI primitives (Modal, SearchableSelect, Map)
│   │   ├── features/        # Auth, Dashboard, Trips, Expenses, Emergency
│   │   └── shared/          # API client, transient auth storage, contexts
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **PostgreSQL:** Local PostgreSQL instance or remote database (Neon, Supabase, Render Postgres)
- **Git**

---

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create your `.env` configuration in `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development

   # PostgreSQL Connection (Use DATABASE_URL or individual params)
   DATABASE_URL=postgres://postgres:your_password@localhost:5432/traveldost_db
   # Optional: set to 'false' if using self-signed development certificates
   DB_SSL_REJECT_UNAUTHORIZED=true

   # JWT Secret (min 32 characters)
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
   JWT_EXPIRES_IN=15m

   # CORS Allowed Origins (comma-separated)
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

---

### Database Migrations & Seeding

1. Create the database in PostgreSQL if it does not exist:
   ```sql
   CREATE DATABASE traveldost_db;
   ```

2. Run the database migrations:
   ```bash
   npm run migrate:up
   ```

3. Seed the country emergency guides:
   ```bash
   npm run db:init
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000/api`.

---

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🔐 Environment Variables Summary

### `backend/.env`
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | API server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/traveldost_db` |
| `DB_SSL_REJECT_UNAUTHORIZED` | Strict TLS certificate check | `true` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secure-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration duration | `15m` |
| `CORS_ORIGINS` | Permitted client URLs | `http://localhost:5173,https://traveldost.vercel.app` |

### `frontend/.env`
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

---

## 🚀 Production Deployment

- **Backend:** Deployed on Render using `render.yaml`. Migrations execute as a pre-deploy hook:
  ```bash
  npm run migrate:up && npm start
  ```
- **Frontend:** Hosted on Vercel with automatic single-page application routing rewrites (`vercel.json`) and PWA asset caching.

---

## 🤝 Contact

**Developer:** Durgesh Kanzariya

- **Email:** durgesh.j.kanzariya@gmail.com
- **GitHub:** [github.com/durgesh-kanzariya](https://github.com/durgesh-kanzariya)

*Made with ❤️ | © 2026 TravelDost*
