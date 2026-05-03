import { logger } from '../../config/logger.config.js';

export async function handlePackageUpdated(event, metadata = {}) {
  logger.info('Package updated received by TMS', {
    event,
    metadata,
  });

  // Future: update package logistics state and recalculate dispatch readiness.
}
