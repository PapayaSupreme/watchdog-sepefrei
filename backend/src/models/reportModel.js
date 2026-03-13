import { query } from '../config/db.js';

export async function createReport({ monitorId, reporterName, message }) {
  const result = await query(
    `
    INSERT INTO incident_reports (monitor_id, reporter_name, message)
    VALUES ($1, $2, $3)
    RETURNING id, monitor_id, reporter_name, message, created_at
    `,
    [monitorId, reporterName, message],
  );

  return result.rows[0];
}

export async function listReportsByMonitor(monitorId, limit = 100) {
  const result = await query(
    `
    SELECT id, monitor_id, reporter_name, message, created_at
    FROM incident_reports
    WHERE monitor_id = $1
    ORDER BY created_at DESC
    LIMIT $2
    `,
    [monitorId, limit],
  );

  return result.rows;
}

export async function countRecentReports(monitorId, minutesWindow = 15) {
  const result = await query(
    `
    SELECT COUNT(*)::int AS total
    FROM incident_reports
    WHERE monitor_id = $1
      AND created_at >= NOW() - make_interval(mins => $2)
    `,
    [monitorId, minutesWindow],
  );

  return result.rows[0].total;
}

