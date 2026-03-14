CREATE TABLE IF NOT EXISTS monitors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  frequency_seconds INTEGER NOT NULL CHECK (frequency_seconds >= 15),
  next_check_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ping_logs (
  id BIGSERIAL PRIMARY KEY,
  monitor_id INTEGER NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('up', 'down', 'timeout', 'error')),
  http_status INTEGER,
  response_time_ms INTEGER,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS incident_reports (
  id BIGSERIAL PRIMARY KEY,
  monitor_id INTEGER NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  reporter_name VARCHAR(80) NOT NULL,
  reporter_ip VARCHAR(45),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outages (
  id BIGSERIAL PRIMARY KEY,
  monitor_id INTEGER NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  detection_type VARCHAR(20) NOT NULL CHECK (detection_type IN ('automatic', 'user', 'mixed')),
  cause TEXT
);

CREATE INDEX IF NOT EXISTS idx_ping_logs_monitor_checked
  ON ping_logs (monitor_id, checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_monitor_created
  ON incident_reports (monitor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_monitor_reporter_created
  ON incident_reports (monitor_id, LOWER(reporter_name), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_monitor_ip_created
  ON incident_reports (monitor_id, reporter_ip, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outages_monitor_started
  ON outages (monitor_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_monitors_next_check
  ON monitors (next_check_at ASC);

INSERT INTO monitors (name, url, frequency_seconds)
VALUES
  ('SEPEFREI', 'https://sepefrei.fr', 60),
  ('Link', 'https://link.sepefrei.fr', 60),
  ('Etudiant', 'https://etudiant.sepefrei.fr', 60),
  ('Portainer', 'https://portainer.sepefrei.fr', 60),
  ('Plausible', 'https://plausible.sepefrei.fr', 60),
  ('n8n', 'https://n8n.sepefrei.fr', 60)
ON CONFLICT (url) DO NOTHING;

