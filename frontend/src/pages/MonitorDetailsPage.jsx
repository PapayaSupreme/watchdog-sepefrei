import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import PingHistoryChart from '../components/PingHistoryChart.jsx';
import ReportDownForm from '../components/ReportDownForm.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { formatDate, formatDuration } from '../utils/format.js';

// Renders one monitor detail view (no args), loads monitor/logs/outages/reports, and handles manual report submission.
export default function MonitorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState(null);
  const [logs, setLogs] = useState([]);
  const [outages, setOutages] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

  // Fetches monitor detail datasets in parallel (id) and stores them in component state.
  async function loadData() {
    const [monitorData, logData, outageData, reportData] = await Promise.all([
      api.getMonitor(id),
      api.getLogs(id),
      api.getOutages(id),
      api.getReports(id),
    ]);

    setMonitor(monitorData);
    setLogs(logData);
    setOutages(outageData);
    setReports(reportData);
  }

  // Posts a manual down report payload (payload), updates feedback message, and refreshes monitor data.
  async function submitReport(payload) {
    const created = await api.createReport(id, payload);
    setMessage(
      created.strongSignal
        ? 'Report sent. Strong incident signal detected.'
        : 'Report sent.',
    );
    await loadData();
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(error.message));
  }, [id]);

  usePolling(() => {
    loadData().catch(() => {});
  }, 10000, [id]);

  if (!monitor) {
    return <p>Loading monitor...</p>;
  }

  return (
    <section>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate('/')}
      >
        Back to dashboard
      </button>
      <h1>
        <a
          href={monitor.url}
          target="_blank"
          rel="noreferrer"
          className="monitor-title-link"
        >
          {monitor.name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="external-link-icon"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </h1>
      <p>{monitor.url}</p>
      <StatusBadge status={monitor.current_status} />
      {message && <p className="info">{message}</p>}

      <div className="grid">
        <div className="card table-card">
          <h3>Ping response trend</h3>
          <PingHistoryChart logs={logs} />
        </div>

        <div className="card table-card">
          <h3>Outage history</h3>
          <table>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {outages.map((outage) => (
                <tr key={outage.id}>
                  <td>{formatDate(outage.started_at)}</td>
                  <td>{formatDate(outage.ended_at)}</td>
                  <td>{formatDuration(outage.duration_seconds)}</td>
                  <td>{outage.detection_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid">
        <div className="card table-card">
          <h3>User reports</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Reporter</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{formatDate(report.created_at)}</td>
                  <td>{report.reporter_name}</td>
                  <td>{report.message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReportDownForm onSubmit={submitReport} />
      </div>
    </section>
  );
}

