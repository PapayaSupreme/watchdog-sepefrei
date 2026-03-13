import {
  createMonitor,
  getMonitorById,
  listMonitors,
} from '../models/monitorModel.js';
import { createMonitorSchema } from '../utils/validation.js';

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

export async function postMonitor(req, res, next) {
  try {
    const parsed = createMonitorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const monitor = await createMonitor(parsed.data);
    res.status(201).json(monitor);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'A monitor with this URL already exists' });
    }

    next(error);
  }
}

