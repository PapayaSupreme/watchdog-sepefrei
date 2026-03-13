import { env } from '../config/env.js';
import { createPingLog, getLastTwoStatuses } from '../models/logModel.js';
import { claimDueMonitors } from '../models/monitorModel.js';
import {
  closeOutage,
  getOpenOutageByMonitor,
  openOutage,
} from '../models/outageModel.js';
import { pingUrl } from '../services/pingService.js';
import { evaluateOutageTransition } from '../services/outageService.js';

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

export function startScheduler() {
  const run = async () => {
    try {
      const monitors = await claimDueMonitors(env.schedulerBatchSize);
      await Promise.all(monitors.map((monitor) => processMonitor(monitor)));
    } catch (error) {
      console.error('[scheduler] run failed:', error.message);
    }
  };

  run();
  return setInterval(run, env.schedulerIntervalMs);
}

