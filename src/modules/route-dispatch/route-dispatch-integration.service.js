import { logger } from '../../config/logger.config.js';
import { documentClient } from '../../infrastructure/http/document.client.js';
import { packingClient } from '../../infrastructure/http/packing.client.js';
import { wmsClient } from '../../infrastructure/http/wms.client.js';

class RouteDispatchIntegrationService {
  async notifyDispatchStarted(dispatch) {
    try {
      await wmsClient.notifyRouteDispatchStarted({
        routeDispatchId: dispatch.id,
        routeId: dispatch.routeId,
        warehouseId: dispatch.warehouseId,
        routeDisplayId: dispatch.routeDisplayId,
        dispatcherId: dispatch.dispatcherId,
        dispatchStartTime: dispatch.dispatchStartTime,
      });
    } catch (error) {
      logger.error('Failed to notify WMS about route dispatch started', {
        error,
        routeDispatchId: dispatch.id,
      });

      return null;
    }
  }

  async notifyDispatchFinished(dispatch) {
    try {
      await wmsClient.notifyRouteDispatchFinished({
        routeDispatchId: dispatch.id,
        routeId: dispatch.routeId,
        warehouseId: dispatch.warehouseId,
        routeDisplayId: dispatch.routeDisplayId,
        dispatchEndTime: dispatch.dispatchEndTime,
        packages: dispatch.packages,
      });

      await packingClient.markPackagesDispatched({
        routeDispatchId: dispatch.id,
        routeId: dispatch.routeId,
        packages: dispatch.packages,
      });
    } catch (error) {
      logger.error('Failed to notify external services about route dispatch finished', {
        error,
        routeDispatchId: dispatch.id,
      });

      return null;
    }
  }

  async generateManifest(dispatch) {
    try {
      return await documentClient.generateRouteManifest({
        routeDispatchId: dispatch.id,
        routeId: dispatch.routeId,
        warehouseId: dispatch.warehouseId,
        routeDisplayId: dispatch.routeDisplayId,
        packages: dispatch.packages,
      });
    } catch (error) {
      logger.error('Failed to generate route manifest', {
        error,
        routeDispatchId: dispatch.id,
      });

      return null;
    }
  }
}

export const routeDispatchIntegrationService =
  new RouteDispatchIntegrationService();
