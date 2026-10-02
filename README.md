# 🚀 Mission Placement

> A monorepo documenting a focused, 97-day journey to master full-stack web development (PERN Stack) and land a software engineering internship by December 2026.

[![GitHub](https://img.shields.io/badge/GitHub-task--masterr01-181717?style=flat&logo=github)](https://github.com/task-masterr01/MISSON-PLACEMENT)
![Stack](https://img.shields.io/badge/Stack-PERN-blue?style=flat)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat)

---

## 🎯 Mission

Turn zero professional experience into an internship offer through deliberate practice, consistent shipping, and building real, working applications — not tutorials.

**Start Date:** September 19, 2026  
**Target:** Internship-ready by December 2026

---

## 🏗️ Repository Structure

```
MISSON-PLACEMENT/
├── NODE/                         # Backend APIs (Express.js + PostgreSQL)
│   ├── O4-student-backend/       # Student Directory API          → Port 5000
│   ├── O5-job-tracker-backend/   # Job Tracker API (JWT Auth)     → Port 5001
│   ├── O6-auth-mastery/          # Auth Deep-Dive (bcrypt + JWT)  → Port 5002
│   └── O7-mentor-track-backend/  # MentorTrack Platform API       → Port 5003
│
└── REACT/                        # Frontend Applications (React + Vite)
    ├── O1-basics/                # React fundamentals
    ├── O2-props/                 # Components & Props
    ├── O3-student-directory/     # Student Directory UI
    ├── O5-job-tracker/           # Job Tracker UI (full-stack)
    └── O8-mentor-track-frontend/ # MentorTrack Platform UI
```

---

## 📦 Projects

### O3 + O4 — College Student Directory *(Full Stack)*

A full-stack directory to view and manage student profiles.

| Layer | Technology |
|-------|------------|
| Frontend | React, `useParams`, `localStorage` |
| Backend | Express.js, PostgreSQL |
| Key Concepts | Dynamic routing, REST API integration, favorites with localStorage |

---

### O5 — Job Application Tracker *(Full Stack · JWT Auth)*

A complete CRUD application for tracking job applications and interview rounds.

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, controlled forms |
| Backend | Express.js, PostgreSQL, JWT, bcrypt |
| Port | `5001` |

**API Endpoints:**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/register` | ❌ | Register a new user |
| `POST` | `/api/login` | ❌ | Login and receive JWT |
| `GET` | `/api/applications` | ✅ | Get all applications |
| `POST` | `/api/applications` | ✅ | Add a new application |
| `PUT` | `/api/applications/:id` | ✅ | Update status / notes |
| `DELETE` | `/api/applications/:id` | ✅ | Delete an application |
| `GET` | `/api/applications/:id/interviews` | ✅ | Get interviews for an application |
| `POST` | `/api/applications/:id/interviews` | ✅ | Add an interview round |

---

### O6 — Auth Mastery *(Concept Deep-Dive)*

A focused deep-dive into authentication mechanics — bcrypt password hashing and JWT token generation/verification — built from scratch to understand the internals before using them in larger apps.

| Concept | Implementation |
|---------|---------------|
| Password Hashing | `bcrypt` with 10 salt rounds |
| Token Generation | `jsonwebtoken` with 1-hour expiry |
| Protected Routes | `verifyToken` middleware |
| Port | `5002` |

---

### O7 + O8 — MentorTrack Platform *(Full Stack · Role-Based Auth)*

The most advanced project in the repo. A platform where **mentors** publish learning roadmaps and **students** enroll in them and track their progress — with role-based access control enforced at the API level.

**Backend (O7) — Port `5003`**

| Layer | Technology |
|-------|------------|
| Auth | JWT + bcrypt + role-based middleware (`mentor` / `student`) |
| Database | PostgreSQL — `users`, `roadmaps`, `topics`, `enrollments`, `topic_progress` |

**API Endpoints:**

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/register` | ❌ | — | Register as mentor or student |
| `POST` | `/api/login` | ❌ | — | Login and receive JWT |
| `GET` | `/api/roadmaps` | ❌ | — | Browse all public roadmaps |
| `GET` | `/api/roadmaps/:id` | ❌ | — | Get a roadmap with all its topics |
| `POST` | `/api/roadmaps` | ✅ | Mentor | Create a new roadmap |
| `POST` | `/api/roadmaps/:id/topics` | ✅ | Mentor | Add a topic to a roadmap |
| `POST` | `/api/enrollments` | ✅ | Student | Enroll in a roadmap |
| `POST` | `/api/progress` | ✅ | Student | Mark a topic as complete |

**Frontend (O8) — React + Vite**

| Page | Description |
|------|-------------|
| `Auth.jsx` | Login / Register with role selection |
| `Dashboard.jsx` | Role-aware dashboard — mentors manage roadmaps, students browse and enroll |
| `RoadmapView.jsx` | Full roadmap detail view with topic progress tracking |

---

## 💻 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React.js, React Router, Vite |
| **Styling** | Vanilla CSS, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (`pg` driver) |
| **Auth** | JWT (`jsonwebtoken`), `bcrypt` |
| **Dev Tools** | dotenv, nodemon, CORS |

---

## 🔧 Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL (local instance running)
- `.env` file in each backend directory with:
  ```env
  DB_USER=your_db_user
  DB_HOST=localhost
  DB_NAME=your_db_name
  DB_PASSWORD=your_db_password
  DB_PORT=5432
  JWT_SECRET=your_jwt_secret
  PORT=5001
  ```

### Start a Backend Server
```bash
cd NODE/O7-mentor-track-backend
npm install
node server.js
```

### Start a Frontend App
```bash
cd REACT/O8-mentor-track-frontend
npm install
npm run dev
```

---

## 📈 Progression Map

```
Week 1–2   →  React fundamentals (components, props, state)
Week 3     →  Student Directory — first full-stack connection
Week 4–5   →  Job Tracker — full CRUD + JWT Auth
Week 6     →  Auth Mastery — understanding bcrypt & JWT internals
Week 7+    →  MentorTrack — role-based auth, relational DB, multi-page React app
```

---

## 🧠 What I am Learning (Active Focus)

- Role-based access control (RBAC) patterns in REST APIs
- Relational database design with multiple JOINs
- React state management across multiple protected pages
- Writing clean, production-ready Express middleware

---

## 👤 Author

**Rishabh** — BCA 2nd Year | Aspiring Full-Stack Developer  
📍 India | Target: Software Engineering Internship, December 2026  
🔗 [GitHub](https://github.com/task-masterr01)
