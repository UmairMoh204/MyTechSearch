# MyTechSearch

A responsive job application tracking dashboard built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Java 21 / Spring Boot**, and **SQLite**.

## Features

- Pipeline dashboard with Saved → Applied → Interview → Offer → Rejected
- Kanban board with drag-and-drop, plus a spreadsheet list view
- Create, edit, delete, and update application status
- Search, conversion rates, and company logos
- Browser-only workspace preferences
- Local SQLite persistence with API validation and error messages

## Requirements

- Java 21 and Maven 3.9+
- Node.js 20+ and npm

## Run locally

Start the backend in one terminal:

```bash
cd backend
./mvnw spring-boot:run
```

Start the frontend in another:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to http://localhost:8080.

SQLite creates `backend/applications.db` automatically. That file is excluded from Git.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/applications | List applications |
| GET | /api/applications/{id} | Application detail |
| POST | /api/applications | Create |
| PUT | /api/applications/{id} | Update |
| DELETE | /api/applications/{id} | Delete |
| GET | /api/applications/stats | Counts |

Example request:

```json
{
  "company": "Example Co",
  "position": "Software Engineer",
  "status": "Applied",
  "appliedDate": "2026-10-28",
  "notes": "Recruiter call next week"
}
```

Statuses: Saved, Applied, Interview, Offer, Rejected.

## Important

This is a single-user local development project without authentication. Do not deploy the backend publicly without adding authentication, authorization, and production configuration. No third-party job board integration is included.

## Next improvements

- JUnit API integration tests
- Export applications as CSV
- Authentication if multi-user hosting is required
