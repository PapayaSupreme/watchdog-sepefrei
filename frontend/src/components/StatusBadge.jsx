// Renders a styled monitor status badge (status) and returns uppercase fallback text for undefined states.
export default function StatusBadge({ status }) {
  const normalized = status ?? 'checking';
  const className = `badge badge-${normalized}`;
  return <span className={className}>{normalized.toUpperCase()}</span>;
}

