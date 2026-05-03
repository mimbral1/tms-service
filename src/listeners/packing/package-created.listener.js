import { logger } from '../../config/logger.config.js';

export async function handlePackageCreated(event, metadata = {}) {
  logger.info('Package created received by TMS', {
    event,
    metadata,
  });

  // Future: associate package to shipping and prepare it for dispatch.
}
