import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { monitorRoutes } from './routes/monitorRoutes.js';
import { logRoutes } from './routes/logRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';

export const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', monitorRoutes);
app.use('/api', logRoutes);
app.use('/api', statsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

