// Formats a date-like value (dateValue) into local date/time text and returns '-' when empty.
export function formatDate(dateValue) {
  if (!dateValue) {
    return '-';
  }

  return new Date(dateValue).toLocaleString();
}

// Formats a duration in seconds (seconds) into compact human-readable text and returns '-' when nullish.
export function formatDuration(seconds) {
  if (seconds == null) {
    return '-';
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

// Converts a date-like value (dateValue) into relative time text like '5m ago' and returns '-' when empty.
export function formatRelativeTime(dateValue) {
  if (!dateValue) {
    return '-';
  }

  const deltaMs = Date.now() - new Date(dateValue).getTime();
  const deltaSeconds = Math.max(0, Math.floor(deltaMs / 1000));

  if (deltaSeconds < 60) {
    return `${deltaSeconds}s ago`;
  }

  const deltaMinutes = Math.floor(deltaSeconds / 60);
  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}

