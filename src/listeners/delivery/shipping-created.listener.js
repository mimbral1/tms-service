import { logger } from '../../config/logger.config.js';

export async function handleShippingCreated(event, metadata = {}) {
  logger.info('Shipping created received by TMS', {
    event,
    metadata,
  });

  // Future: store local snapshot and evaluate automatic planning.
}
