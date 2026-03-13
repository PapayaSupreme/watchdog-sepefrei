import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';

export const statsRoutes = Router();

statsRoutes.get('/stats', getStats);

