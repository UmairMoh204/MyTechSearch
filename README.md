# MyTechSearch

A small full-stack job application tracker with a React/TypeScript frontend, Java Spring Boot REST API, and persistent SQLite storage.

## Tech stack
- Frontend: React 18, TypeScript, Vite, CSS
- Backend: Java 21, Spring Boot 3.3, Spring Web, Spring JDBC, Bean Validation
- Database: SQLite (local file, created automatically)

## Start backend
Install Java 21 and Maven, then:
```bash
cd backend
mvn spring-boot:run
```
The API runs at http://localhost:8080/api/applications.

## Start frontend
Install Node.js 20+ and npm, then:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## API
- GET /api/applications
- GET /api/applications/{id}
- POST /api/applications
- PUT /api/applications/{id}
- DELETE /api/applications/{id}
- GET /api/applications/stats

Example POST JSON: `{"company":"Example Co","position":"Software Engineer","status":"Applied","appliedDate":"2026-10-28","notes":""}`

## Scope
Single-user MVP: create, list, search and delete applications, basic status counts. Edit UI, authentication, filtering by status and tests are future improvements. Do not expose the local API on the public internet without authentication.
