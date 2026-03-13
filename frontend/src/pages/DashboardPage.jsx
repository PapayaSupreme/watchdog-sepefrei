import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import DownAlert from '../components/DownAlert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { formatDate } from '../utils/format.js';

export default function DashboardPage() {
  const [monitors, setMonitors] = useState([]);
  const [error, setError] = useState('');

  async function loadMonitors() {
    try {
      const data = await api.getMonitors();
      setMonitors(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  usePolling(loadMonitors, 10000, []);

  const downCount = monitors.filter((monitor) =>
    ['down', 'timeout', 'error'].includes(monitor.current_status),
  ).length;

  const latestCheckedAt = monitors.reduce((latest, monitor) => {
    if (!monitor.last_checked_at) {
      return latest;
    }

    if (!latest) {
      return monitor.last_checked_at;
    }

    return new Date(monitor.last_checked_at) > new Date(latest)
      ? monitor.last_checked_at
      : latest;
  }, null);

  return (
    <section>
      <h1>Watchdog Dashboard</h1>
      <DownAlert downCount={downCount} />
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Monitored sites</h3>
        <div className="last-check-panel">
          <span className="last-check-label">Latest successful sweep</span>
          <strong className="last-check-value">{formatDate(latestCheckedAt)}</strong>
        </div>
        <div className="monitor-grid">
          {monitors.map((monitor) => (
            <Link
              key={monitor.id}
              to={`/monitors/${monitor.id}`}
              className="monitor-cell"
            >
              <div className="monitor-cell-header">
                <span className="monitor-name">{monitor.name}</span>
                <StatusBadge status={monitor.current_status} />
              </div>
              <p className="monitor-url">{monitor.url}</p>
              <div className="monitor-meta">
                <span>
                  Response:{' '}
                  {monitor.last_response_time_ms != null
                    ? `${monitor.last_response_time_ms} ms`
                    : '-'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

