import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const monitorModelMock = vi.hoisted(() => ({
  listMonitors: vi.fn(),
  getMonitorById: vi.fn(),
}));

const logModelMock = vi.hoisted(() => ({
  listLogsByMonitor: vi.fn(),
}));

const reportModelMock = vi.hoisted(() => ({
  listReportsByMonitor: vi.fn(),
  createReport: vi.fn(),
  countRecentReports: vi.fn(),
  getRecentReportByIp: vi.fn(),
}));

const outageModelMock = vi.hoisted(() => ({
  listOutagesByMonitor: vi.fn(),
}));

const statsServiceMock = vi.hoisted(() => ({
  getGlobalStats: vi.fn(),
}));

vi.mock('../src/models/monitorModel.js', () => monitorModelMock);
vi.mock('../src/models/logModel.js', () => logModelMock);
vi.mock('../src/models/reportModel.js', () => reportModelMock);
vi.mock('../src/models/outageModel.js', () => outageModelMock);
vi.mock('../src/services/statsService.js', () => statsServiceMock);

const { app } = await import('../src/app.js');

describe('API endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not allow creating a monitor', async () => {
    const response = await request(app).post('/api/monitors').send({
      name: 'Site',
      url: 'https://example.com',
      frequencySeconds: 30,
    });

    expect(response.status).toBe(404);
  });

  it('lists monitors', async () => {
    monitorModelMock.listMonitors.mockResolvedValue([{ id: 1, name: 'A' }]);

    const response = await request(app).get('/api/monitors');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('gets monitor history', async () => {
    monitorModelMock.getMonitorById.mockResolvedValue({ id: 1 });
    logModelMock.listLogsByMonitor.mockResolvedValue([{ id: 1, status: 'up' }]);

    const response = await request(app).get('/api/logs/1');

    expect(response.status).toBe(200);
    expect(response.body[0].status).toBe('up');
  });

  it('creates report site down', async () => {
    monitorModelMock.getMonitorById.mockResolvedValue({ id: 1 });
    reportModelMock.getRecentReportByIp.mockResolvedValue(null);
    reportModelMock.createReport.mockResolvedValue({ id: 2, monitor_id: 1 });
    reportModelMock.countRecentReports.mockResolvedValue(3);

    const response = await request(app)
      .post('/api/monitors/1/reports')
      .set('X-Forwarded-For', '203.0.113.10')
      .send({
        reporterName: 'Ana',
        message: 'Seems unavailable',
      });

    expect(response.status).toBe(201);
    expect(response.body.strongSignal).toBe(true);
    expect(reportModelMock.createReport).toHaveBeenCalledWith({
      monitorId: 1,
      reporterIp: '203.0.113.10',
      reporterName: 'Ana',
      message: 'Seems unavailable',
    });
  });

  it('rate limits repeated reports from the same user for the same monitor', async () => {
    monitorModelMock.getMonitorById.mockResolvedValue({ id: 1 });
    reportModelMock.getRecentReportByIp.mockResolvedValue({
      id: 9,
      created_at: new Date(),
    });

    const response = await request(app)
      .post('/api/monitors/1/reports')
      .set('X-Forwarded-For', '203.0.113.10')
      .send({
        reporterName: 'Ana',
        message: 'Still down',
      });

    expect(response.status).toBe(429);
    expect(response.body.retryAfterSeconds).toBeGreaterThanOrEqual(0);
    expect(reportModelMock.createReport).not.toHaveBeenCalled();
  });

  it('returns stats', async () => {
    statsServiceMock.getGlobalStats.mockResolvedValue({ uptimePercentage: 99.9 });

    const response = await request(app).get('/api/stats');

    expect(response.status).toBe(200);
    expect(response.body.uptimePercentage).toBe(99.9);
  });
});

