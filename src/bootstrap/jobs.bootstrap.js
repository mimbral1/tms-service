import { logger } from '../config/logger.config.js';
import { startDriverAvailabilitySyncJob } from '../jobs/driver-availability-sync.job.js';
import { startRouteAlertsJob } from '../jobs/route-alerts.job.js';
import { startRouteEtaJob } from '../jobs/route-eta.job.js';
import { startRoutePlanningProcessorJob } from '../jobs/route-planning-processor.job.js';
import { startOutboxPublisherJob } from '../outbox/jobs/outbox-publisher.job.js';

export function bootstrapJobs() {
  startOutboxPublisherJob();
  startRouteAlertsJob();
  startRouteEtaJob();
  startRoutePlanningProcessorJob();
  startDriverAvailabilitySyncJob();

  logger.info('Jobs bootstrap completed');
}
