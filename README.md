# Store Ratings Platform

A full-stack web application where users submit 1–5 star ratings for registered stores. Three roles: System Administrator, Normal User, Store Owner.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Forms | react-hook-form + zod |
| HTTP client | Fetch API (custom client, httpOnly cookie auth) |
| Backend | Express.js 5 (modular monolith) |
| Auth | JWT + bcryptjs + httpOnly cookies |
| Database driver | `pg` (node-postgres) |
| Database | PostgreSQL |

## Project Structure

```
store-ratings/
├── frontend/     # React + Vite + Tailwind
└── backend/      # Express modular monolith
    └── src/
        ├── lib/       # db pool (pg), initDb, seed
        ├── modules/   # auth, users, stores, ratings, admin, owner
        └── middleware/ # auth, requireRole, validate
```

## Setup

### 1. Backend

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/store_ratings
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

```bash
cd backend

# Install dependencies
npm install

# Create tables in PostgreSQL
npm run db:init

# Seed sample data (optional)
npm run db:seed

# Start dev server (http://localhost:5000)
npm run dev
```

### 2. Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

## Default Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin123! |

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Dashboard stats, manage users & stores |
| **Normal User** | Browse stores, submit/update ratings |
| **Store Owner** | View own store's ratings dashboard |

## API Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/signup` | public | Normal user registration |
| POST | `/api/auth/login` | public | Login (sets httpOnly cookie) |
| POST | `/api/auth/logout` | authenticated | Logout |
| PATCH | `/api/auth/password` | authenticated | Change password |
| GET | `/api/admin/stats` | admin | Dashboard counts |
| GET | `/api/users` | admin | List users (filter/sort) |
| POST | `/api/users` | admin | Create user |
| GET | `/api/users/:id` | admin | User detail |
| GET | `/api/stores` | admin, user | List stores |
| POST | `/api/stores` | admin | Create store |
| GET | `/api/stores/:id` | admin, user | Store detail |
| PATCH | `/api/stores/:id` | admin | Assign / change store owner |
| POST | `/api/ratings` | user | Submit rating |
| PATCH | `/api/ratings/:id` | user | Update rating |
| GET | `/api/owner/dashboard` | store_owner | Owner dashboard |

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Email | Valid email format |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Address | Max 400 characters |
| Rating | Integer 1–5 |
