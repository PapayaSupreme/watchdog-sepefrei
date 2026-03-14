import { query } from '../config/db.js';

// Inserts a manual incident report (monitorId, reporterName, reporterIp, message) and returns the created report row.
export async function createReport({
  monitorId,
  reporterName,
  reporterIp,
  message,
}) {
  const result = await query(
    `
    INSERT INTO incident_reports (monitor_id, reporter_name, reporter_ip, message)
    VALUES ($1, $2, $3, $4)
    RETURNING id, monitor_id, reporter_name, message, created_at
    `,
    [monitorId, reporterName, reporterIp, message],
  );

  return result.rows[0];
}

// Fetches the most recent report for a monitor/IP pair (monitorId, reporterIp, hoursWindow) and returns a row or null.
export async function getRecentReportByIp(monitorId, reporterIp, hoursWindow = 1) {
  const result = await query(
    `
    SELECT id, monitor_id, reporter_name, reporter_ip, message, created_at
    FROM incident_reports
    WHERE monitor_id = $1
      AND reporter_ip = $2
      AND created_at >= NOW() - make_interval(hours => $3)
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [monitorId, reporterIp, hoursWindow],
  );

  return result.rows[0] ?? null;
}

// Lists recent reports for one monitor (monitorId, limit) and returns rows ordered by newest first.
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

// Counts reports submitted in a rolling minute window (monitorId, minutesWindow) and returns an integer total.
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

