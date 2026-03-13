import { useEffect } from 'react';

export function usePolling(callback, intervalMs, dependencies = []) {
  useEffect(() => {
    callback();
    const timer = setInterval(callback, intervalMs);
    return () => clearInterval(timer);
  }, dependencies);
}

