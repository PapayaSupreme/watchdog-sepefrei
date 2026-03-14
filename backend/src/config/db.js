import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

// Executes one SQL statement (text, params) against PostgreSQL and returns the pg result promise.
export const query = (text, params) => pool.query(text, params);

// Ensures incident report schema compatibility at startup by adding reporter_ip column/index when missing.
export async function ensureDatabaseSchema() {
  await query(`
    ALTER TABLE incident_reports
    ADD COLUMN IF NOT EXISTS reporter_ip VARCHAR(45)
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_reports_monitor_ip_created
      ON incident_reports (monitor_id, reporter_ip, created_at DESC)
  `);
}

