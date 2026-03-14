import { env } from '../config/env.js';
import {
  createPingLog,
  deletePingLogsBefore,
  getLastTwoStatuses,
} from '../models/logModel.js';
import { claimDueMonitors } from '../models/monitorModel.js';
import {
  closeOutage,
  getOpenOutageByMonitor,
  openOutage,
} from '../models/outageModel.js';
import { pingUrl } from '../services/pingService.js';
import { evaluateOutageTransition } from '../services/outageService.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

async function processMonitor(monitor) {
  const pingResult = await pingUrl(monitor.url);

  const createdLog = await createPingLog({
    monitorId: monitor.id,
    checkedAt: pingResult.checkedAt,
    status: pingResult.status,
    httpStatus: pingResult.httpStatus,
    responseTimeMs: pingResult.responseTimeMs,
    errorMessage: pingResult.errorMessage,
  });

  const latestTwo = await getLastTwoStatuses(monitor.id);
  const previousStatus = latestTwo[1]?.status ?? 'up';
  const transition = evaluateOutageTransition(previousStatus, pingResult.status);

  if (transition === 'start') {
    await openOutage({
      monitorId: monitor.id,
      startedAt: createdLog.checked_at,
      detectionType: 'automatic',
      cause: pingResult.errorMessage ?? `HTTP ${pingResult.httpStatus ?? 'N/A'}`,
    });
  }

  if (transition === 'end') {
    const open = await getOpenOutageByMonitor(monitor.id);
    if (open) {
      await closeOutage({ outageId: open.id, endedAt: createdLog.checked_at });
    }
  }
}

export async function cleanupOldPingLogs(now = new Date()) {
  const cutoff = new Date(
    now.getTime() - env.pingLogRetentionDays * DAY_IN_MS,
  );

  return deletePingLogsBefore(cutoff);
}

export async function runSchedulerCycle(state = { lastCleanupAt: 0 }, now = new Date()) {
  const monitors = await claimDueMonitors(env.schedulerBatchSize);
  await Promise.all(monitors.map((monitor) => processMonitor(monitor)));

  if (now.getTime() - state.lastCleanupAt >= env.logCleanupIntervalMs) {
    await cleanupOldPingLogs(now);
    state.lastCleanupAt = now.getTime();
  }
}

export function startScheduler() {
  const state = { lastCleanupAt: 0 };

  const run = async () => {
    try {
      await runSchedulerCycle(state);
    } catch (error) {
      console.error('[scheduler] run failed:', error.message);
    }
  };

  run();
  return setInterval(run, env.schedulerIntervalMs);
}

