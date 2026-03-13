import { getMonitorById } from '../models/monitorModel.js';
import {
  countRecentReports,
  createReport,
  listReportsByMonitor,
} from '../models/reportModel.js';
import { createReportSchema } from '../utils/validation.js';

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

    const report = await createReport({ monitorId, ...parsed.data });
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

