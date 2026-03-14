import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { monitorRoutes } from './routes/monitorRoutes.js';
import { logRoutes } from './routes/logRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';

export const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Responds to health checks (/api/health) with a simple status payload for uptime probes.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', monitorRoutes);
app.use('/api', logRoutes);
app.use('/api', statsRoutes);

// Catches unhandled route/controller errors and returns a 500 JSON response.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

