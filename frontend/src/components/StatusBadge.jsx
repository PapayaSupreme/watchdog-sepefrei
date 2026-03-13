export default function StatusBadge({ status }) {
  const normalized = status ?? 'checking';
  const className = `badge badge-${normalized}`;
  return <span className={className}>{normalized.toUpperCase()}</span>;
}

