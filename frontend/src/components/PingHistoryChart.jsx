import { formatDate } from '../utils/format.js';

export default function PingHistoryChart({ logs }) {
  const data = [...logs]
    .filter(
      (log) =>
        log.checked_at &&
        typeof log.response_time_ms === 'number' &&
        Number.isFinite(log.response_time_ms),
    )
    .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at));

  if (data.length < 2) {
    return <p className="chart-empty">Not enough response-time samples to draw the chart yet.</p>;
  }

  const width = 760;
  const height = 260;
  const padding = 28;
  const values = data.map((log) => log.response_time_ms);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = Math.max(1, maxValue - minValue);

  const points = data
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const y =
        height -
        padding -
        ((point.response_time_ms - minValue) / valueRange) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const latest = data[data.length - 1];

  return (
    <div>
      <div className="chart-header">
        <strong>{latest.response_time_ms} ms</strong>
        <span>{formatDate(latest.checked_at)}</span>
      </div>
      <div className="chart-surface">
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Response time history">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="chart-axis" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="chart-axis" />
          <polyline fill="none" points={points} className="chart-line" />
        </svg>
      </div>
      <div className="chart-footer">
        <span>Min: {minValue} ms</span>
        <span>Max: {maxValue} ms</span>
        <span>Samples: {data.length}</span>
      </div>
    </div>
  );
}

