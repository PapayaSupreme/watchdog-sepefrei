import { getMonitorById } from '../models/monitorModel.js';
import { listOutagesByMonitor } from '../models/outageModel.js';

// Handles GET /monitors/:id/outages (req, res, next), validates monitor, fetches outage history, and returns JSON or 404.
export async function getOutages(req, res, next) {
  try {
    const monitorId = Number(req.params.id);
    const monitor = await getMonitorById(monitorId);

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    const outages = await listOutagesByMonitor(monitorId);
    res.json(outages);
  } catch (error) {
    next(error);
  }
}

