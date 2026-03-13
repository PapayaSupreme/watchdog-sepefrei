# Watchdog

Watchdog is a full-stack uptime monitoring MVP for a Junior Enterprise internal supervision tool.

It provides:
- automatic website checks with outage/recovery detection
- ping history and outage history
- manual "site is down" user reports
- global availability statistics

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Containerization: Docker + Docker Compose

## Project structure

```text
watchdog-sepefrei/
  backend/
	db/
	  init.sql
	src/
	  config/
	  controllers/
	  jobs/
	  models/
	  routes/
	  services/
	  utils/
	  app.js
	  server.js
	tests/
	Dockerfile
	package.json
  frontend/
	src/
	  api/
	  components/
	  hooks/
	  pages/
	  utils/
	  App.jsx
	  main.jsx
	  styles.css
	tests/
	Dockerfile
	package.json
  docker-compose.yml
  .env.example
  README.md
```

## Main features delivered

1. **Automatic monitoring**
   - scheduler checks each monitor based on `frequency_seconds`
   - each ping is saved in `ping_logs` with status, latency, http status, and error
   - outages are opened/closed automatically in `outages`

2. **Failure history**
   - full ping history per monitor (`GET /api/logs/:id`)
   - outage history per monitor (`GET /api/monitors/:id/outages`)

3. **Manual user down signal**
   - `POST /api/monitors/:id/reports` stores user reports
   - reports displayed on monitor details page
   - strong signal highlighted when several reports happen in a short window

4. **Statistics**
   - `GET /api/stats` returns uptime %, total downtime, interruptions, avg response time

## API endpoints

- `GET /api/monitors`
- `POST /api/monitors`
- `GET /api/monitors/:id`
- `GET /api/logs/:id`
- `GET /api/stats`
- `POST /api/monitors/:id/reports`
- `GET /api/monitors/:id/reports`
- `GET /api/monitors/:id/outages`

## Database schema

Initialized from `backend/db/init.sql`:
- `monitors`
- `ping_logs`
- `incident_reports`
- `outages`

Seeded monitors:
- `sepefrei.fr`
- `link.sepefrei.fr`
- `etudiant.sepefrei.fr`
- `portainer.sepefrei.fr`
- `plausible.sepefrei.fr`
- `n8n.sepefrei.fr`

## Run with Docker (one command)

```bash
docker-compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`
- PostgreSQL: `localhost:5432`

## Local development (without Docker)

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

## Architecture notes

- Backend is layered (`routes -> controllers -> services/models`).
- Scheduler logic is isolated in `backend/src/jobs/scheduler.js`.
- Current monitor status is derived from the latest ping log.
- UI uses polling refresh every 10 seconds.

## Current limitations

- No authentication/authorization yet.
- No notification channels (email, Slack, SMS) yet.
- Scheduler runs in-process with the API container (single-service MVP choice).
