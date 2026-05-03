import { logger } from '../../config/logger.config.js';
import { userClient } from '../../infrastructure/http/user.client.js';
import { mapDriverUserResponse } from '../../infrastructure/http/mappers/user-response.mapper.js';

class DriverSyncService {
  async getDriverFromUserService(userId) {
    const response = await userClient.getDriverByUserId(userId);
    return mapDriverUserResponse(response);
  }

  async syncDriverFromUserEvent(event, driverRepository) {
    try {
      const payload = event.payload || event;
      const userId = payload.userId || payload.id;

      if (!userId) {
        logger.warn('Driver sync skipped because userId is missing', { event });
        return null;
      }

      const externalDriver = await this.getDriverFromUserService(userId);

      logger.info('Driver data received from User Service', {
        userId,
        externalDriver,
      });

      void driverRepository;

      return externalDriver;
    } catch (error) {
      logger.error('Failed to sync driver from User Service', {
        error,
        event,
      });

      throw error;
    }
  }
}

export const driverSyncService = new DriverSyncService();
