import { query } from '../config/db.js';

const monitorSelect = `
  SELECT
    m.id,
    m.name,
    m.url,
    m.frequency_seconds,
    m.created_at,
    m.updated_at,
    pl.status AS current_status,
    pl.checked_at AS last_checked_at,
    pl.response_time_ms AS last_response_time_ms,
    pl.http_status AS last_http_status
  FROM monitors m
  LEFT JOIN LATERAL (
    SELECT status, checked_at, response_time_ms, http_status
    FROM ping_logs
    WHERE monitor_id = m.id
    ORDER BY checked_at DESC
    LIMIT 1
  ) pl ON true
`;

export async function listMonitors() {
  const result = await query(`${monitorSelect} ORDER BY m.id ASC`);
  return result.rows;
}

export async function getMonitorById(id) {
  const result = await query(`${monitorSelect} WHERE m.id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function createMonitor({ name, url, frequencySeconds }) {
  const result = await query(
    `
    INSERT INTO monitors (name, url, frequency_seconds, next_check_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, name, url, frequency_seconds, created_at, updated_at
    `,
    [name, url, frequencySeconds],
  );

  return result.rows[0];
}

export async function claimDueMonitors(batchSize) {
  const result = await query(
    `
    WITH due AS (
      SELECT id
      FROM monitors
      WHERE next_check_at <= NOW()
      ORDER BY next_check_at ASC
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE monitors m
    SET
      next_check_at = NOW() + make_interval(secs => m.frequency_seconds),
      updated_at = NOW()
    FROM due
    WHERE m.id = due.id
    RETURNING m.id, m.name, m.url, m.frequency_seconds
    `,
    [batchSize],
  );

  return result.rows;
}

