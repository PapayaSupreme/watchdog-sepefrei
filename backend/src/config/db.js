import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export const query = (text, params) => pool.query(text, params);

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

