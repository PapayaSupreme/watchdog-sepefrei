import { Router } from 'express';
import { getMonitorLogs } from '../controllers/logController.js';

export const logRoutes = Router();

logRoutes.get('/logs/:id', getMonitorLogs);

