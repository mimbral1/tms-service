import { logger } from '../config/logger.config.js';

let isRunning = false;
let intervalId = null;

export async function runRoutePlanningProcessorJob() {
  if (isRunning) return;

  isRunning = true;

  try {
    logger.debug('Route planning processor job executed');

    // Future: process route plannings in processing status.
  } catch (error) {
    logger.error('Route planning processor job failed', { error });
  } finally {
    isRunning = false;
  }
}

export function startRoutePlanningProcessorJob() {
  if (intervalId) return intervalId;

  intervalId = setInterval(runRoutePlanningProcessorJob, 30000);
  logger.info('Route planning processor job started');

  return intervalId;
}

export class RoutePlanningProcessorJob {
  async run() {
    await runRoutePlanningProcessorJob();
  }
}
