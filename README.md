# MyTechSearch

A responsive job application tracking dashboard powered by **React + TypeScript**, **Java Spring Boot**, and **SQLite**.

## Features
- Dashboard with application, interview, offer and rejection counts
- Create, edit and delete job applications
- Change application status directly from the table
- Search by company, position or notes; filter by status
- Local SQLite persistence, validation and API error messages
- Responsive layout for desktop and mobile

## Requirements
- Java 21, Maven 3.9+
- Node.js 20+ and npm

## Run locally
Start the backend in one terminal:
```bash
cd backend
mvn spring-boot:run
```
Start the frontend in another:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. Backend API: http://localhost:8080/api/applications.

SQLite database is created at `backend/applications.db` automatically. It is excluded from Git.

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/applications | List |
| GET | /api/applications/{id} | Detail |
| POST | /api/applications | Create |
| PUT | /api/applications/{id} | Update |
| DELETE | /api/applications/{id} | Delete |
| GET | /api/applications/stats | Counts |

Example request:
```json
{"company":"Example Co","position":"Software Engineer","status":"Applied","appliedDate":"2026-10-28","notes":"Recruiter call next week"}
```

Statuses: Applied, Interview, Offer, Rejected.

## Important
This is a single-user local development project, without authentication. **Do not deploy the backend publicly** without adding authentication, authorization and production configuration. No third-party job board integration is included.

## Next improvements
- JUnit API integration tests
- Export applications as CSV
- Authentication if multi-user hosting is required
