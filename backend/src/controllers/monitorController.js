import {
  getMonitorById,
  listMonitors,
} from '../models/monitorModel.js';

// Handles GET /monitors (req, res, next), reads monitors from DB, and returns a JSON monitor list.
export async function getMonitors(req, res, next) {
  try {
    const monitors = await listMonitors();
    res.json(monitors);
  } catch (error) {
    next(error);
  }
}

// Handles GET /monitors/:id (req, res, next), fetches one monitor by route id, and returns JSON or 404.
export async function getMonitor(req, res, next) {
  try {
    const monitor = await getMonitorById(Number(req.params.id));
    if (!monitor) {
      return res.status(404).json({ message: 'Monitor not found' });
    }

    res.json(monitor);
  } catch (error) {
    next(error);
  }
}

