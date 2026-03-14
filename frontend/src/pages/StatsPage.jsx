import { useState } from 'react';
import { api } from '../api/client.js';
import { usePolling } from '../hooks/usePolling.js';

// Renders global KPI cards (no args), polls backend stats endpoint, and displays API errors when present.
export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  usePolling(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }, 10000, []);

  if (!stats) {
    return <p>Loading global stats...</p>;
  }

  return (
    <section>
      <h1>Global statistics</h1>
      {error && <p className="error">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Uptime</h3>
          <p>{stats.uptimePercentage}%</p>
        </div>
        <div className="stat-card">
          <h3>Total downtime</h3>
          <p>{stats.totalDowntimeSeconds}s</p>
        </div>
        <div className="stat-card">
          <h3>Interruptions</h3>
          <p>{stats.interruptionCount}</p>
        </div>
        <div className="stat-card">
          <h3>Average response</h3>
          <p>{stats.averageResponseTimeMs} ms</p>
        </div>
      </div>
    </section>
  );
}

