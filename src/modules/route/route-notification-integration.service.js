import { logger } from '../../config/logger.config.js';
import { notificationClient } from '../../infrastructure/http/notification.client.js';

class RouteNotificationIntegrationService {
  async notifyRouteStarted(route) {
    try {
      await notificationClient.sendNotification({
        type: 'route.started',
        channel: 'internal',
        title: 'Ruta iniciada',
        message: `La ruta ${route.displayId} fue iniciada.`,
        metadata: {
          routeId: route.id,
          routeDisplayId: route.displayId,
        },
      });
    } catch (error) {
      logger.error('Failed to send route started notification', {
        error,
        routeId: route.id,
      });
    }
  }

  async notifyShippingDelivered(shippingId, routeId) {
    try {
      await notificationClient.sendNotification({
        type: 'shipping.delivered',
        channel: 'customer',
        title: 'Pedido entregado',
        message: 'Tu pedido fue entregado correctamente.',
        metadata: {
          shippingId,
          routeId,
        },
      });
    } catch (error) {
      logger.error('Failed to send delivered notification', {
        error,
        shippingId,
        routeId,
      });
    }
  }

  async notifyShippingFailed(shippingId, routeId) {
    try {
      await notificationClient.sendNotification({
        type: 'shipping.failed',
        channel: 'customer',
        title: 'Problema con la entrega',
        message: 'No pudimos completar la entrega de tu pedido.',
        metadata: {
          shippingId,
          routeId,
        },
      });
    } catch (error) {
      logger.error('Failed to send failed delivery notification', {
        error,
        shippingId,
        routeId,
      });
    }
  }
}

export const routeNotificationIntegrationService =
  new RouteNotificationIntegrationService();
