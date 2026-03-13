export function classifyHttpStatus(httpStatus) {
  if (httpStatus >= 200 && httpStatus < 400) {
    return 'up';
  }

  return 'down';
}

export function isDownState(status) {
  return status === 'down' || status === 'timeout' || status === 'error';
}

