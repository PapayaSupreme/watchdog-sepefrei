import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgres://postgres:postgres@localhost:5432/watchdog',
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 8000),
  schedulerIntervalMs: Number(process.env.SCHEDULER_INTERVAL_MS ?? 5000),
  schedulerBatchSize: Number(process.env.SCHEDULER_BATCH_SIZE ?? 10),
};

