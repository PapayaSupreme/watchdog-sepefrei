import { useEffect } from 'react';

// Runs callback immediately and on an interval (callback, intervalMs, dependencies), then clears timer on cleanup.
export function usePolling(callback, intervalMs, dependencies = []) {
  useEffect(() => {
    callback();
    const timer = setInterval(callback, intervalMs);
    return () => clearInterval(timer);
  }, dependencies);
}

