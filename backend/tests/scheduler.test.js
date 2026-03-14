import { beforeEach, describe, expect, it, vi } from 'vitest';

const logModelMock = vi.hoisted(() => ({
  createPingLog: vi.fn(),
  deletePingLogsBefore: vi.fn(),
  getLastTwoStatuses: vi.fn(),
}));

const monitorModelMock = vi.hoisted(() => ({
  claimDueMonitors: vi.fn(),
}));

const outageModelMock = vi.hoisted(() => ({
  closeOutage: vi.fn(),
  getOpenOutageByMonitor: vi.fn(),
  openOutage: vi.fn(),
}));

const pingServiceMock = vi.hoisted(() => ({
  pingUrl: vi.fn(),
}));

vi.mock('../src/models/logModel.js', () => logModelMock);
vi.mock('../src/models/monitorModel.js', () => monitorModelMock);
vi.mock('../src/models/outageModel.js', () => outageModelMock);
vi.mock('../src/services/pingService.js', () => pingServiceMock);

const { runSchedulerCycle } = await import('../src/jobs/scheduler.js');

describe('scheduler cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    monitorModelMock.claimDueMonitors.mockResolvedValue([]);
    logModelMock.deletePingLogsBefore.mockResolvedValue(12);
  });

  it('deletes ping logs older than retention on the first cycle', async () => {
    const state = { lastCleanupAt: 0 };
    const now = new Date('2026-03-14T12:00:00.000Z');

    await runSchedulerCycle(state, now);

    expect(logModelMock.deletePingLogsBefore).toHaveBeenCalledTimes(1);
    const [cutoff] = logModelMock.deletePingLogsBefore.mock.calls[0];
    expect(cutoff).toBeInstanceOf(Date);
    expect(cutoff.toISOString()).toBe('2026-03-07T12:00:00.000Z');
    expect(state.lastCleanupAt).toBe(now.getTime());
  });

  it('does not delete ping logs again before the cleanup interval elapses', async () => {
    const state = { lastCleanupAt: 0 };

    await runSchedulerCycle(state, new Date('2026-03-14T12:00:00.000Z'));
    await runSchedulerCycle(state, new Date('2026-03-14T12:30:00.000Z'));

    expect(logModelMock.deletePingLogsBefore).toHaveBeenCalledTimes(1);
  });
});

