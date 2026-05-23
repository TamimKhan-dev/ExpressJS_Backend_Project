# DevPulse — Issue & Feature Tracker API

A collaborative backend platform for software teams to report bugs, suggest features, and coordinate resolutions. Built with Node.js, TypeScript, Express, and PostgreSQL.

**Live URL:** https://devpulse-peach.vercel.app  
**Author:** Tamim Khan

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor & maintainer)
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Reporter details attached to every issue response
- Secure password hashing with bcrypt
- Global error handling and CORS support

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (LTS) | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | Web framework |
| PostgreSQL (NeonDB) | Relational database |
| Raw SQL | Direct query execution via neon serverless driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT generation and verification |

---

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- A NeonDB (or any PostgreSQL) database

### Installation

```bash
# Clone the repository
git clone https://github.com/TamimKhan-dev/devpulse
cd devpulse

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## Database Schema

### users

| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incrementing unique identifier |
| name | VARCHAR(255) NOT NULL | Full display name |
| email | VARCHAR(255) UNIQUE NOT NULL | Login email address |
| password | TEXT NOT NULL | Bcrypt hashed password |
| role | VARCHAR(20) | Either `contributor` or `maintainer`, defaults to `contributor` |
| created_at | TIMESTAMP | Auto-generated on insert |
| updated_at | TIMESTAMP | Auto-refreshed on update |

### issues

| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incrementing unique identifier |
| reporter_id | INT NOT NULL | ID of the user who submitted the issue |
| title | VARCHAR(150) NOT NULL | Short descriptive headline |
| description | TEXT NOT NULL | Detailed explanation |
| type | TEXT | Either `bug` or `feature_request` |
| status | TEXT | One of `open`, `in_progress`, `resolved`. Defaults to `open` |
| created_at | TIMESTAMP | Auto-generated on insert |
| updated_at | TIMESTAMP | Auto-refreshed on update |

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Authenticate and receive JWT token |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues with optional filters |
| GET | `/api/issues/:id` | Public | Get a single issue by ID |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue (partial) |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters for GET /api/issues

| Param | Values | Default |
|---|---|---|
| sort | `newest`, `oldest` | `newest` |
| type | `bug`, `feature_request` | none |
| status | `open`, `in_progress`, `resolved` | none |

**Example:** `GET /api/issues?sort=oldest&type=bug&status=open`

---

## Authorization Rules

- **JWT** must be passed in the `Authorization` header as a raw token (no Bearer prefix)
- **Contributors** can create issues and update their own issues only if status is `open`
- **Maintainers** can update any issue, delete any issue, and change issue status freely

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

## Project Structure

```
src/
  config/         # Environment and database configuration
  middleware/      # Auth and error handling middleware
  modules/
    auth/          # Signup and login logic
    issues/        # Issues CRUD logic
  utils/           # Reusable helpers (sendResponse, catchAsync)
  types/           # TypeScript interfaces and enums
  server.ts        # App entry point
