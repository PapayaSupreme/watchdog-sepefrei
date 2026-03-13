import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import AddMonitorForm from '../components/AddMonitorForm.jsx';
import DownAlert from '../components/DownAlert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { formatDate } from '../utils/format.js';

export default function DashboardPage() {
  const [monitors, setMonitors] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadMonitors() {
    try {
      const data = await api.getMonitors();
      setMonitors(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function createMonitor(payload) {
    setSaving(true);
    try {
      await api.createMonitor(payload);
      await loadMonitors();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  usePolling(loadMonitors, 10000, []);

  const downCount = monitors.filter((monitor) =>
    ['down', 'timeout', 'error'].includes(monitor.current_status),
  ).length;

  return (
    <section>
      <h1>Watchdog Dashboard</h1>
      <DownAlert downCount={downCount} />
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <div className="card table-card">
          <h3>Monitored sites</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Status</th>
                <th>Last check</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((monitor) => (
                <tr key={monitor.id}>
                  <td>
                    <Link to={`/monitors/${monitor.id}`}>{monitor.name}</Link>
                  </td>
                  <td>{monitor.url}</td>
                  <td>
                    <StatusBadge status={monitor.current_status} />
                  </td>
                  <td>{formatDate(monitor.last_checked_at)}</td>
                  <td>
                    {monitor.last_response_time_ms != null
                      ? `${monitor.last_response_time_ms} ms`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddMonitorForm onSubmit={createMonitor} loading={saving} />
      </div>
    </section>
  );
}

