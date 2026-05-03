import { logger } from '../config/logger.config.js';

let isRunning = false;
let intervalId = null;

export async function runRouteEtaJob() {
  if (isRunning) return;

  isRunning = true;

  try {
    logger.debug('Route ETA job executed');

    // Future: recalculate ETA for started routes and emit ETA updates.
  } catch (error) {
    logger.error('Route ETA job failed', { error });
  } finally {
    isRunning = false;
  }
}

export function startRouteEtaJob() {
  if (intervalId) return intervalId;

  intervalId = setInterval(runRouteEtaJob, 120000);
  logger.info('Route ETA job started');

  return intervalId;
}

export class RouteEtaJob {
  async run() {
    await runRouteEtaJob();
  }
}
