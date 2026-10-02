# 🧭 MentorTrack — Backend API

> A role-based REST API built with Express.js and PostgreSQL. Mentors publish learning roadmaps; students enroll and track their progress. Full JWT authentication with role enforcement at the middleware level.

---

## 🚀 Quick Start

```bash
npm install
node server.js
# Server runs on http://localhost:5003
```

Create a `.env` file in this directory:

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5003
```

---

## 🏗️ Database Schema

```
users
  id, name, email, password (hashed), role (mentor | student)

roadmaps
  id, title, description, mentor_id → users.id, is_public, created_at

topics
  id, roadmap_id → roadmaps.id, title, description, order_index

enrollments
  id, student_id → users.id, roadmap_id → roadmaps.id  [UNIQUE]

topic_progress
  id, student_id → users.id, topic_id → topics.id  [UNIQUE]
```

---

## 🔐 Auth & Middleware

| Middleware | Purpose |
|------------|---------|
| `verifyToken` | Validates the JWT from `Authorization: Bearer <token>` header |
| `isMentor` | Checks `req.user.role === 'mentor'` — rejects anyone else |

The role is embedded in the JWT at login/registration and verified server-side on every protected request.

---

## 📡 API Endpoints

### Auth Routes (Public)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/register` | Register as `mentor` or `student`. Returns JWT. |
| `POST` | `/api/login` | Login with email + password. Returns JWT. |

**Register body:**
```json
{ "name": "Rishabh", "email": "r@r.com", "password": "pass123", "role": "mentor" }
```

**Login body:**
```json
{ "email": "r@r.com", "password": "pass123" }
```

---

### Roadmap Routes

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| `GET` | `/api/roadmaps` | ❌ | — | List all public roadmaps (with mentor name) |
| `GET` | `/api/roadmaps/:id` | ❌ | — | Get a single roadmap with all its topics |
| `POST` | `/api/roadmaps` | ✅ | Mentor | Create a new roadmap |
| `POST` | `/api/roadmaps/:id/topics` | ✅ | Mentor | Add a topic to a roadmap |

**Create roadmap body:**
```json
{ "title": "PERN Stack Mastery", "description": "From zero to full-stack", "is_public": true }
```

**Add topic body:**
```json
{ "title": "Node.js Fundamentals", "description": "Event loop, modules, npm", "order_index": 1 }
```

---

### Student Routes

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/enrollments` | ✅ | Student | Enroll in a roadmap |
| `POST` | `/api/progress` | ✅ | Student | Mark a topic as complete |

**Enroll body:**
```json
{ "roadmap_id": 1 }
```

**Mark progress body:**
```json
{ "topic_id": 3 }
```

---

## 🧪 Testing

A complete test script is included to verify the full flow:

```bash
node test-flow.js
```

Tests: register mentor → login → create roadmap → add topic → register student → enroll → mark topic complete

---

## 💻 Tech Stack

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |
| `pg` | PostgreSQL client (connection pool) |
| `bcrypt` | Password hashing (10 salt rounds) |
| `jsonwebtoken` | JWT generation and verification |
| `dotenv` | Environment variable management |
| `cors` | Cross-origin request handling |

---

## 🔗 Related

- **Frontend:** [`REACT/O8-mentor-track-frontend`](../../REACT/O8-mentor-track-frontend)
- **Auth deep-dive:** [`NODE/O6-auth-mastery`](../O6-auth-mastery)
