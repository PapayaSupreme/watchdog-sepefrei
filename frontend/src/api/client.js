const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

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

export const api = {
  getMonitors: () => request('/monitors'),
  createMonitor: (data) =>
    request('/monitors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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

