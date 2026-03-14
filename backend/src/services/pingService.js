import { env } from '../config/env.js';
import { classifyHttpStatus } from './statusService.js';

// Performs a timed HTTP GET probe (url, timeoutMs), classifies result/timeout/error, and returns normalized ping metadata.
export async function pingUrl(url, timeoutMs = env.requestTimeoutMs) {
  const controller = new AbortController();
  const startTime = Date.now();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
    });

    return {
      status: classifyHttpStatus(response.status),
      httpStatus: response.status,
      responseTimeMs: Date.now() - startTime,
      errorMessage: null,
      checkedAt: new Date(),
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        status: 'timeout',
        httpStatus: null,
        responseTimeMs: timeoutMs,
        errorMessage: `Request timeout after ${timeoutMs}ms`,
        checkedAt: new Date(),
      };
    }

    return {
      status: 'error',
      httpStatus: null,
      responseTimeMs: Date.now() - startTime,
      errorMessage: error.message,
      checkedAt: new Date(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

