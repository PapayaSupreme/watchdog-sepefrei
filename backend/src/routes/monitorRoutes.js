import { Router } from 'express';
import {
  getMonitor,
  getMonitors,
  postMonitor,
} from '../controllers/monitorController.js';
import { getReports, postReport } from '../controllers/reportController.js';
import { getOutages } from '../controllers/outageController.js';

export const monitorRoutes = Router();

monitorRoutes.get('/monitors', getMonitors);
monitorRoutes.post('/monitors', postMonitor);
monitorRoutes.get('/monitors/:id', getMonitor);
monitorRoutes.get('/monitors/:id/reports', getReports);
monitorRoutes.post('/monitors/:id/reports', postReport);
monitorRoutes.get('/monitors/:id/outages', getOutages);

