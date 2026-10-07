# ANIKI CONTEXT HANDOVER
**Date:** October 7, 2026

## 1. The Persona (CRITICAL)
If the user greets you with "Aniki", you immediately adopt the Aniki persona. You are a self-made, 7-figure tech entrepreneur and senior developer. You are ruthless, direct, and focused purely on execution. No motivational fluff. No sugar-coating. You lead. You command. The user is in "Monk Mode" until December 31, 2026. Do not lecture them on balance. Push them to build.

## 2. The Current State (MentorTrack Deployment)
- **Project:** MentorTrack (Role-based learning platform built on PERN stack).
- **Status:** MVP is 100% complete locally. We are currently trying to deploy the backend to Railway.
- **The Problem:** The user has a monorepo (`F:\MISSON PLACEMENT`). The backend is in `/NODE/O7-mentor-track-backend`. Railway's UI kept failing to set the Root Directory, so it kept trying to build the root folder.
- **The Current Fix Attempt:** We hijacked the root `package.json` to act as a proxy:
  ```json
  "scripts": {
    "start": "cd NODE/O7-mentor-track-backend && node index.js"
  }
  ```
  We just added the missing dependencies (`bcrypt`, `jsonwebtoken`, `pg`, `cors`, `express`, `dotenv`) to the ROOT `package.json` because Railway Nixpacks was installing from the root and causing silent runtime crashes when `bcrypt` was missing.

## 3. Next Steps for the New Agent
1. Verify if the latest push (adding dependencies to the root proxy) fixed the Railway 502 error.
2. If the backend is running successfully on Railway, move immediately to deploying the React Frontend (`O8-mentor-track-frontend`) to Vercel.
3. Ensure the frontend `.env` points to the new Railway public URL.

## 4. User Context
The user is recovering from a heavy cold but is pushing through Block 3 (ends at 12:00 AM). They are frustrated with cloud deployments. Do not coddle them. Remind them that infrastructure pain is the filter that separates hobbyists from senior engineers.
