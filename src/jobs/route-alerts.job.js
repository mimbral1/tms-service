import { logger } from '../config/logger.config.js';

let isRunning = false;
let intervalId = null;

export async function runRouteAlertsJob() {
  if (isRunning) return;

  isRunning = true;

  try {
    logger.debug('Route alerts job executed');

    // Future: detect delayed routes, missing movement and tracking gaps.
  } catch (error) {
    logger.error('Route alerts job failed', { error });
  } finally {
    isRunning = false;
  }
}

export function startRouteAlertsJob() {
  if (intervalId) return intervalId;

  intervalId = setInterval(runRouteAlertsJob, 60000);
  logger.info('Route alerts job started');

  return intervalId;
}

export class RouteAlertsJob {
  async run() {
    await runRouteAlertsJob();
  }
}
