# Mini CRM

A full-stack CRM dashboard for managing leads with JWT authentication and role-based access (Admin / Sales Agent).

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT
- **Frontend:** React, Vite, Redux Toolkit, RTK Query, Tailwind CSS

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run seed    # creates demo users (first time only)
npm run dev     # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Demo accounts

| Role        | Email               | Password  |
|-------------|---------------------|-----------|
| Admin       | admin@minicrm.com   | admin123  |
| Sales Agent | agent@minicrm.com   | agent123  |

## API endpoints

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/login`     | Login              |
| GET    | `/api/auth/me`        | Current user       |
| POST   | `/api/auth/logout`    | Logout             |
| GET    | `/api/leads`          | List leads         |
| POST   | `/api/leads`          | Create lead (admin) |
| PUT    | `/api/leads/:id`      | Update lead (admin) |
| DELETE | `/api/leads/:id`      | Delete lead (admin) |
| PATCH  | `/api/leads/:id/status` | Update status (admin & assigned agent) |
| PATCH  | `/api/leads/:id/assign` | Assign (admin)   |
| GET    | `/api/dashboard`      | Stats & activities |
| GET    | `/api/users/team`     | Team for assignment |
| GET    | `/api/users`          | All users (admin)   |
| POST   | `/api/users`          | Create sales agent (admin) |

## Roles

- **Admin:** Full lead CRUD, assign leads, users management, full dashboard
- **Sales Agent:** View assigned leads, update lead status only

## Environment

Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

Frontend uses `VITE_API_URL` (default: `http://localhost:5000/api`).
