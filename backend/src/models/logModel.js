import { query } from '../config/db.js';

// Inserts one ping log record (monitor/status/timing payload) into ping_logs and returns the created row.
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

// Fetches recent ping logs for one monitor (monitorId, limit) and returns rows ordered by newest check first.
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

// Fetches the two latest statuses for a monitor (monitorId) to evaluate outage transitions and returns up to two rows.
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

// Fetches ping logs between from/to timestamps for stats aggregation and returns rows ordered by check time ascending.
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

// Deletes ping logs older than cutoff date (cutoff) and returns the number of deleted rows.
export async function deletePingLogsBefore(cutoff) {
  const result = await query(
    `
    DELETE FROM ping_logs
    WHERE checked_at < $1
    `,
    [cutoff],
  );

  return result.rowCount ?? 0;
}

