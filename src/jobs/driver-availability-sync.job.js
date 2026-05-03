import { logger } from '../config/logger.config.js';

let isRunning = false;
let intervalId = null;

export async function runDriverAvailabilitySyncJob() {
  if (isRunning) return;

  isRunning = true;

  try {
    logger.debug('Driver availability sync job executed');

    // Future: release drivers and expire outdated planning windows.
  } catch (error) {
    logger.error('Driver availability sync job failed', { error });
  } finally {
    isRunning = false;
  }
}

export function startDriverAvailabilitySyncJob() {
  if (intervalId) return intervalId;

  intervalId = setInterval(runDriverAvailabilitySyncJob, 60000);
  logger.info('Driver availability sync job started');

  return intervalId;
}

export class DriverAvailabilitySyncJob {
  async run() {
    await runDriverAvailabilitySyncJob();
  }
}
