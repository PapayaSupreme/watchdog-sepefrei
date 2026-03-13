import {
  getMonitorById,
  listMonitors,
} from '../models/monitorModel.js';

export async function getMonitors(req, res, next) {
  try {
    const monitors = await listMonitors();
    res.json(monitors);
  } catch (error) {
    next(error);
  }
}

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

