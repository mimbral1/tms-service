import { logger } from '../../config/logger.config.js';

export async function handleShippingCancelled(event, metadata = {}) {
  logger.info('Shipping cancelled received by TMS', {
    event,
    metadata,
  });

  // Future: remove or mark route actions depending on route state.
}
