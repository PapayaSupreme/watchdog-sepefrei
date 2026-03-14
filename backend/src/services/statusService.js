// Classifies an HTTP status code (httpStatus) into monitor state and returns 'up' for 2xx/3xx else 'down'.
export function classifyHttpStatus(httpStatus) {
  if (httpStatus >= 200 && httpStatus < 400) {
    return 'up';
  }

  return 'down';
}

// Checks whether a monitor state string (status) represents downtime and returns a boolean.
export function isDownState(status) {
  return status === 'down' || status === 'timeout' || status === 'error';
}

