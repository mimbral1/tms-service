import { logger } from '../../config/logger.config.js';

export async function handleShippingReadyForPickup(event, metadata = {}) {
  logger.info('Shipping ready for pickup received by TMS', {
    event,
    metadata,
  });

  // Future: mark shipping as eligible for planning and trigger planning if needed.
}
