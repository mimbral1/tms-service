import { logger } from '../../config/logger.config.js';
import { publishPendingEventsUseCase } from '../application/publish-pending-events.usecase.js';

let isRunning = false;
let intervalId = null;

export async function runOutboxPublisherJob() {
  if (isRunning) return;

  isRunning = true;

  try {
    await publishPendingEventsUseCase.execute();
  } finally {
    isRunning = false;
  }
}

export function startOutboxPublisherJob() {
  if (intervalId) return intervalId;

  intervalId = setInterval(runOutboxPublisherJob, 5000);
  logger.info('Outbox publisher job started');

  return intervalId;
}

export class OutboxPublisherJob {
  async run() {
    await runOutboxPublisherJob();
  }
}
