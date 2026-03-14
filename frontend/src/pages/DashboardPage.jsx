import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import DownAlert from '../components/DownAlert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { formatDate, formatRelativeTime } from '../utils/format.js';

// Renders dashboard monitor cards (no args), polls monitor status, and shows latest-check and down-alert summaries.
export default function DashboardPage() {
  const [monitors, setMonitors] = useState([]);
  const [error, setError] = useState('');

  // Fetches monitor list from API, updates local state, and captures request error text for UI display.
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
  const checkedCount = monitors.filter((monitor) => Boolean(monitor.last_checked_at)).length;

  return (
    <section>
      <h1>Watchdog Dashboard</h1>
      <DownAlert downCount={downCount} />
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Monitored sites</h3>
        <div className="last-check-panel">
          <span className="last-check-label">Latest check</span>
          <strong className="last-check-value">{formatDate(latestCheckedAt)}</strong>
          <div className="last-check-meta">
            <span>{formatRelativeTime(latestCheckedAt)}</span>
            <span>
              {checkedCount}/{monitors.length} monitors checked
            </span>
          </div>
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

