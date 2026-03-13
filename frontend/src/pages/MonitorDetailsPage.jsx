import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import PingHistoryChart from '../components/PingHistoryChart.jsx';
import ReportDownForm from '../components/ReportDownForm.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { formatDate, formatDuration } from '../utils/format.js';

export default function MonitorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState(null);
  const [logs, setLogs] = useState([]);
  const [outages, setOutages] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

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
      <h1>{monitor.name}</h1>
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

