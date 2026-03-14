const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

// Performs one HTTP request (path, options) to backend API, parses JSON, and returns data or throws Error on non-2xx.
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(payload.message ?? 'Request failed');
  }

  return response.json();
}

// Exposes typed API calls for monitor, log, report, outage, and stats endpoints; each method returns parsed JSON.
export const api = {
  getMonitors: () => request('/monitors'),
  getMonitor: (id) => request(`/monitors/${id}`),
  getLogs: (id) => request(`/logs/${id}`),
  getReports: (id) => request(`/monitors/${id}/reports`),
  createReport: (id, data) =>
    request(`/monitors/${id}/reports`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOutages: (id) => request(`/monitors/${id}/outages`),
  getStats: () => request('/stats'),
};

