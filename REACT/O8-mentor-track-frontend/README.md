# 🧭 MentorTrack — Frontend

> React + Vite frontend for the MentorTrack platform. Role-aware UI where mentors manage learning roadmaps and students enroll and track their progress.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# App runs on http://localhost:5173
```

Make sure the backend API is running on `http://localhost:5003` before starting the frontend.

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Auth.jsx          # Login / Register with role selection
│   ├── Dashboard.jsx     # Role-aware home page after login
│   └── RoadmapView.jsx   # Full roadmap detail with topic progress
├── App.jsx               # Route definitions (React Router)
├── main.jsx              # Entry point
└── index.css             # Global styles
```

---

## 🖥️ Pages

### `Auth.jsx` — Login & Register
- Toggle between Login and Register mode
- Role selection on register: `mentor` or `student`
- On success: stores JWT in `localStorage`, redirects to Dashboard

### `Dashboard.jsx` — Role-Aware Home
| User Role | What They See |
|-----------|---------------|
| **Mentor** | Form to create new roadmaps + list of their roadmaps |
| **Student** | Browse all public roadmaps + enroll with one click |

### `RoadmapView.jsx` — Roadmap Detail
- Displays roadmap title, description, and mentor name
- Lists all topics in order
- Students can mark individual topics as complete
- Mentors can add new topics directly from this page

---

## 🔐 Auth Flow

```
User registers/logs in → receives JWT
     ↓
JWT stored in localStorage
     ↓
Every API request sends: Authorization: Bearer <token>
     ↓
Backend verifies token + role → responds accordingly
```

On logout: JWT is removed from `localStorage`, user is redirected to `/auth`.

---

## 🔗 API Connection

All requests point to `http://localhost:5003`. Key calls:

| Action | Method | Endpoint |
|--------|--------|----------|
| Register | `POST` | `/api/register` |
| Login | `POST` | `/api/login` |
| Get roadmaps | `GET` | `/api/roadmaps` |
| Get roadmap + topics | `GET` | `/api/roadmaps/:id` |
| Create roadmap | `POST` | `/api/roadmaps` |
| Add topic | `POST` | `/api/roadmaps/:id/topics` |
| Enroll | `POST` | `/api/enrollments` |
| Mark topic done | `POST` | `/api/progress` |

---

## 💻 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Vite | Dev server and bundler |
| Vanilla CSS | Styling |
| `fetch` API | HTTP requests to backend |

---

## 🔗 Related

- **Backend API:** [`NODE/O7-mentor-track-backend`](../../NODE/O7-mentor-track-backend)
