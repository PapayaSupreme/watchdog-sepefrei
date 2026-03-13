import { describe, expect, it } from 'vitest';
import { calculateStatsFromLogs } from '../src/services/statsService.js';

describe('statsService', () => {
  it('computes uptime and avg response time', () => {
    const logs = [
      { status: 'up', response_time_ms: 100 },
      { status: 'up', response_time_ms: 300 },
      { status: 'down', response_time_ms: null },
    ];

    expect(calculateStatsFromLogs(logs)).toEqual({
      uptimePercentage: 66.67,
      averageResponseTimeMs: 200,
      totalChecks: 3,
      failedChecks: 1,
    });
  });

  it('returns default values for empty logs', () => {
    expect(calculateStatsFromLogs([])).toEqual({
      uptimePercentage: 100,
      averageResponseTimeMs: 0,
      totalChecks: 0,
      failedChecks: 0,
    });
  });
});

