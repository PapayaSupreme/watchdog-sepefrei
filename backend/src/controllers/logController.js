import { listLogsByMonitor } from '../models/logModel.js';
import { getMonitorById } from '../models/monitorModel.js';

export async function getMonitorLogs(req, res, next) {
  try {
    const monitorId = Number(req.params.id);
    const monitor = await getMonitorById(monitorId);

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    const limit = Number(req.query.limit ?? 100);
    const logs = await listLogsByMonitor(monitorId, limit);

    res.json(logs);
  } catch (error) {
    next(error);
  }
}

