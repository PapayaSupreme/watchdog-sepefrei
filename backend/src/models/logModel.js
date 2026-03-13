import { query } from '../config/db.js';

export async function createPingLog({
  monitorId,
  checkedAt,
  status,
  httpStatus,
  responseTimeMs,
  errorMessage,
}) {
  const result = await query(
    `
    INSERT INTO ping_logs (
      monitor_id,
      checked_at,
      status,
      http_status,
      response_time_ms,
      error_message
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [monitorId, checkedAt, status, httpStatus, responseTimeMs, errorMessage],
  );

  return result.rows[0];
}

export async function listLogsByMonitor(monitorId, limit = 100) {
  const result = await query(
    `
    SELECT id, monitor_id, checked_at, status, http_status, response_time_ms, error_message
    FROM ping_logs
    WHERE monitor_id = $1
    ORDER BY checked_at DESC
    LIMIT $2
    `,
    [monitorId, limit],
  );

  return result.rows;
}

export async function getLastTwoStatuses(monitorId) {
  const result = await query(
    `
    SELECT status, checked_at, error_message
    FROM ping_logs
    WHERE monitor_id = $1
    ORDER BY checked_at DESC
    LIMIT 2
    `,
    [monitorId],
  );

  return result.rows;
}

export async function listLogsInRange(from, to) {
  const result = await query(
    `
    SELECT monitor_id, checked_at, status, response_time_ms
    FROM ping_logs
    WHERE checked_at BETWEEN $1 AND $2
    ORDER BY checked_at ASC
    `,
    [from, to],
  );

  return result.rows;
}

