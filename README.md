# AI Growth Systems

Enterprise AI automation platform for AI receptionists, missed call recovery, lead reactivation, and appointment setters.

## Overview

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM
- **Auth:** JWT, RBAC
- **AI Integrations:** OpenAI, ElevenLabs, Twilio, SMTP
- **Hosting Ready:** Vercel, AWS, Docker

## Folder Structure

- `app/` — Frontend application and marketing website
- `server/` — Express API, Prisma schema, auth, AI endpoints
- `Dockerfile.app` — Frontend Docker image
- `Dockerfile.server` — Backend Docker image
- `docker-compose.yml` — Local stack with Postgres, API, and frontend

## Local Setup

1. Copy `.env.example` to `.env`
2. Update OpenAI, SMTP, Twilio, and database settings
3. Install dependencies

```bash
npm install
npm --workspace app install
npm --workspace server install
```

4. Run database schema generation and seed data

```bash
npm --workspace server exec prisma db push
npm --workspace server run ts-node server/prisma/seed.ts
```

5. Launch the stack

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

## Production Build

```bash
npm run build
```

## Docker

```bash
docker compose up --build
```

## API Highlights

- `POST /api/auth/login` — authenticate users
- `POST /api/leads` — capture qualified leads
- `GET /api/leads` — retrieve lead list
- `GET /api/dashboard` — dashboard metrics
- `POST /api/chatbot/conversation` — trained AI assistant
- `POST /api/voice/call` — Twilio voice call orchestration

## Database Schema

The Prisma schema includes models for:

- `User`, `Role`, `Permission`
- `Client`, `Lead`, `Appointment`, `Campaign`
- `Call`, `SMS`, `Email`
- `Subscription`, `Invoice`, `Payment`
- `ChatbotLog`, `VoiceLog`, `AuditLog`

## Notes

- Frontend routes are built for landing page, login, client dashboard, admin panel, and superadmin control center.
- AI assistant is trained using service descriptions and service context.
- The platform uses glassmorphism styling, premium animations, and a dark luxury theme.
