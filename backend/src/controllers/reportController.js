import { getMonitorById } from '../models/monitorModel.js';
import {
  countRecentReports,
  createReport,
  getRecentReportByIp,
  listReportsByMonitor,
} from '../models/reportModel.js';
import { createReportSchema } from '../utils/validation.js';

const REPORT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0];

  const rawIp = forwardedIp?.trim() || req.ip || req.socket?.remoteAddress || '';
  return rawIp.replace(/^::ffff:/, '');
}

export async function getReports(req, res, next) {
  try {
    const monitorId = Number(req.params.id);
    const monitor = await getMonitorById(monitorId);

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    const reports = await listReportsByMonitor(monitorId);
    res.json(reports);
  } catch (error) {
    next(error);
  }
}

export async function postReport(req, res, next) {
  try {
    const monitorId = Number(req.params.id);
    const monitor = await getMonitorById(monitorId);

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    const parsed = createReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const reporterIp = getClientIp(req);

    const recentReport = await getRecentReportByIp(monitorId, reporterIp);

    if (recentReport) {
      const createdAt = new Date(recentReport.created_at).getTime();
      const retryAfterMs = Number.isNaN(createdAt)
        ? REPORT_RATE_LIMIT_WINDOW_MS
        : Math.max(0, createdAt + REPORT_RATE_LIMIT_WINDOW_MS - Date.now());

      return res.status(429).json({
        message: 'You can only report the same website once per hour.',
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      });
    }

    const report = await createReport({
      monitorId,
      reporterIp,
      ...parsed.data,
    });
    const reportsInWindow = await countRecentReports(monitorId, 15);

    res.status(201).json({
      ...report,
      strongSignal: reportsInWindow >= 3,
      reportsInLast15Minutes: reportsInWindow,
    });
  } catch (error) {
    next(error);
  }
}

