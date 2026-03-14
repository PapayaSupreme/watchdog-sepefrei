import { getGlobalStats } from '../services/statsService.js';

// Handles GET /stats (req, res, next), computes date range from query params, fetches aggregate stats, and returns JSON.
export async function getStats(req, res, next) {
  try {
    const now = new Date();
    const defaultFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    const to = req.query.to ? new Date(req.query.to) : now;

    const stats = await getGlobalStats({ from, to });
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

