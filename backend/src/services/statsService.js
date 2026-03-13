import { listLogsInRange } from '../models/logModel.js';
import { getOutageTotals } from '../models/outageModel.js';

export function calculateStatsFromLogs(logs) {
  if (logs.length === 0) {
    return {
      uptimePercentage: 100,
      averageResponseTimeMs: 0,
      totalChecks: 0,
      failedChecks: 0,
    };
  }

  const failedChecks = logs.filter((log) => log.status !== 'up').length;
  const successfulLogs = logs.filter(
    (log) => log.status === 'up' && typeof log.response_time_ms === 'number',
  );

  const avgResponseTime =
    successfulLogs.length === 0
      ? 0
      : Math.round(
          successfulLogs.reduce((sum, log) => sum + log.response_time_ms, 0) /
            successfulLogs.length,
        );

  return {
    uptimePercentage: Number(
      (((logs.length - failedChecks) / logs.length) * 100).toFixed(2),
    ),
    averageResponseTimeMs: avgResponseTime,
    totalChecks: logs.length,
    failedChecks,
  };
}

export async function getGlobalStats({ from, to }) {
  const [logs, outageTotals] = await Promise.all([
    listLogsInRange(from, to),
    getOutageTotals(from, to),
  ]);

  const baseStats = calculateStatsFromLogs(logs);

  return {
    ...baseStats,
    totalDowntimeSeconds: outageTotals.total_downtime_seconds,
    interruptionCount: outageTotals.interruption_count,
    period: {
      from,
      to,
    },
  };
}

