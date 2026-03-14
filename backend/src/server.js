import { ensureDatabaseSchema, pool } from './config/db.js';
import { env } from './config/env.js';
import { startScheduler } from './jobs/scheduler.js';
import { app } from './app.js';

await ensureDatabaseSchema();

const server = app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});

let schedulerHandle;
if (env.nodeEnv !== 'test') {
  schedulerHandle = startScheduler();
}

const shutdown = async () => {
  if (schedulerHandle) {
    clearInterval(schedulerHandle);
  }
  await pool.end();
  server.close(() => globalThis.process.exit(0));
};

globalThis.process.on('SIGINT', shutdown);
globalThis.process.on('SIGTERM', shutdown);


