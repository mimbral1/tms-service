import { logger } from '../../config/logger.config.js';
import { driverRepository } from '../../infrastructure/persistence/repositories/driver.repository.js';
import { driverSyncService } from '../../modules/driver/driver-sync.service.js';

export async function handleDriverUpdated(event, metadata = {}) {
  logger.info('Driver updated received by TMS', {
    event,
    metadata,
  });

  await driverSyncService.syncDriverFromUserEvent(event, driverRepository);
}
