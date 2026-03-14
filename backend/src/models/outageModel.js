import { query } from '../config/db.js';

// Inserts a new outage row (monitorId, startedAt, detectionType, cause) and returns the created outage.
export async function openOutage({ monitorId, startedAt, detectionType, cause }) {
  const result = await query(
    `
    INSERT INTO outages (monitor_id, started_at, detection_type, cause)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [monitorId, startedAt, detectionType, cause],
  );

  return result.rows[0];
}

// Fetches the currently open outage for a monitor (monitorId) and returns the latest open row or null.
export async function getOpenOutageByMonitor(monitorId) {
  const result = await query(
    `
    SELECT *
    FROM outages
    WHERE monitor_id = $1 AND ended_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1
    `,
    [monitorId],
  );

  return result.rows[0] ?? null;
}

// Closes an outage by id (outageId, endedAt), computes duration in SQL, and returns the updated outage or null.
export async function closeOutage({ outageId, endedAt }) {
  const result = await query(
    `
    UPDATE outages
    SET
      ended_at = $2,
      duration_seconds = EXTRACT(EPOCH FROM ($2 - started_at))::int
    WHERE id = $1
    RETURNING *
    `,
    [outageId, endedAt],
  );

  return result.rows[0] ?? null;
}

// Lists outage history for one monitor (monitorId, limit) and returns rows ordered by most recent start time.
export async function listOutagesByMonitor(monitorId, limit = 100) {
  const result = await query(
    `
    SELECT id, monitor_id, started_at, ended_at, duration_seconds, detection_type, cause
    FROM outages
    WHERE monitor_id = $1
    ORDER BY started_at DESC
    LIMIT $2
    `,
    [monitorId, limit],
  );

  return result.rows;
}

// Aggregates outage counts and downtime totals inside a date range (from, to) and returns one totals row.
export async function getOutageTotals(from, to) {
  const result = await query(
    `
    SELECT
      COUNT(*)::int AS interruption_count,
      COALESCE(SUM(duration_seconds), 0)::int AS total_downtime_seconds
    FROM outages
    WHERE started_at BETWEEN $1 AND $2
    `,
    [from, to],
  );

  return result.rows[0];
}

