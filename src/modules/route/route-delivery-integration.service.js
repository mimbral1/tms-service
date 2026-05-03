import { logger } from '../../config/logger.config.js';
import { deliveryClient } from '../../infrastructure/http/delivery.client.js';
import { mapShippingResponse } from '../../infrastructure/http/mappers/delivery-response.mapper.js';

class RouteDeliveryIntegrationService {
  async getShipping(shippingId) {
    const response = await deliveryClient.getShippingById(shippingId);
    return mapShippingResponse(response);
  }

  async markAssignedToRoute(shippingId, route) {
    try {
      await deliveryClient.markShippingAssignedToRoute(shippingId, {
        routeId: route.id,
        routeDisplayId: route.displayId,
        driverId: route.driverId,
        vehicleId: route.vehicleId,
      });
    } catch (error) {
      logger.error('Failed to notify Delivery Service about route assignment', {
        error,
        shippingId,
        routeId: route.id,
      });

      throw error;
    }
  }

  async markDelivered(shippingId, payload) {
    try {
      return await deliveryClient.markShippingDelivered(shippingId, payload);
    } catch (error) {
      logger.error('Failed to notify Delivery Service about delivered shipping', {
        error,
        shippingId,
      });

      return null;
    }
  }

  async markFailed(shippingId, payload) {
    try {
      return await deliveryClient.markShippingFailed(shippingId, payload);
    } catch (error) {
      logger.error('Failed to notify Delivery Service about failed shipping', {
        error,
        shippingId,
      });

      return null;
    }
  }
}

export const routeDeliveryIntegrationService = new RouteDeliveryIntegrationService();
