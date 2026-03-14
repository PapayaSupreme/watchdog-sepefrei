# Watchdog

Watchdog is a full-stack uptime monitoring MVP for SEPEFREI's websites.

## 1) Tech stack and websites monitored

### Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Containerization: Docker + Docker Compose

### Websites monitored

- `https://sepefrei.fr`
- `https://link.sepefrei.fr`
- `https://etudiant.sepefrei.fr`
- `https://portainer.sepefrei.fr`
- `https://plausible.sepefrei.fr`
- `https://n8n.sepefrei.fr`

## 2) API routes

- `GET /api/health`
- `GET /api/monitors`
- `GET /api/monitors/:id`
- `GET /api/logs/:id`
- `GET /api/stats`
- `GET /api/monitors/:id/reports`
- `POST /api/monitors/:id/reports`
- `GET /api/monitors/:id/outages`

## 3) Database structure

Schema is initialized from `backend/db/init.sql`.

### `monitors`

- `id`
- `name`
- `url`
- `frequency_seconds`
- `next_check_at`
- `created_at`
- `updated_at`

### `ping_logs`

- `id`
- `monitor_id`
- `checked_at`
- `status` (`up`, `down`, `timeout`, `error`)
- `http_status`
- `response_time_ms`
- `error_message`

### `incident_reports`

- `id`
- `monitor_id`
- `reporter_name`
- `reporter_ip`
- `message`
- `created_at`

### `outages`

- `id`
- `monitor_id`
- `started_at`
- `ended_at`
- `duration_seconds`
- `detection_type` (`automatic`, `user`, `mixed`)
- `cause`

### Retention behavior

- Raw `ping_logs` are pruned after 7 days.
- Outage history remains available in `outages` for longer-term incident tracking.

## 4) Docker setup & service addresses

Start all services with:

```bash
docker-compose up --build
```

Service addresses:

- Frontend: `http://localhost:5173`
- Backend API base: `http://localhost:4000/api`
- PostgreSQL: `localhost:5432`
<br><br>

*Limitation note:*

- Manual outage report rate limiting is currently based **only** on raw client IP (`reporter_ip`) per monitor (1 report/hour), with no authentication identity layer yet.

**Contact:** `pablo.ferreiraa10@gmail.com` <br>
*Made in 2026 by Pablo Ferreira*