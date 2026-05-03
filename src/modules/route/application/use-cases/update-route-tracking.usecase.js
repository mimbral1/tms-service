import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../../shared/errors/ValidationError.js';
import { routeDeliveryIntegrationService } from '../../route-delivery-integration.service.js';
import { routeNotificationIntegrationService } from '../../route-notification-integration.service.js';

export class UpdateRouteTrackingUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(routeId, input, user) {
    const route = await this.routeRepository.findRouteById(routeId);
    if (!route) throw new NotFoundError('Route not found');

    if (route.status !== 'started') {
      throw new ValidationError('Route must be started to update tracking');
    }

    for (const item of input) {
      await this.routeRepository.createRouteTracking(
        routeId,
        {
          routeStopId: item.routeStopId,
          shippingId: item.shippingId || null,
          status: item.status,
          comments: item.comments || [],
          latitude: item.coordinates?.lat ?? null,
          longitude: item.coordinates?.lng ?? null,
          eventDate: item.date || new Date(),
        },
        user.id,
      );

      if (item.status === 'completed' && item.shippingId) {
        await routeDeliveryIntegrationService.markDelivered(item.shippingId, {
          routeId,
          routeStopId: item.routeStopId,
          deliveredAt: item.date || new Date(),
          coordinates: item.coordinates || null,
          comments: item.comments || [],
        });

        await routeNotificationIntegrationService.notifyShippingDelivered(
          item.shippingId,
          routeId,
        );
      }

      if (item.status === 'failed' && item.shippingId) {
        await routeDeliveryIntegrationService.markFailed(item.shippingId, {
          routeId,
          routeStopId: item.routeStopId,
          failedAt: item.date || new Date(),
          coordinates: item.coordinates || null,
          comments: item.comments || [],
          motiveId: item.motiveId || null,
        });

        await routeNotificationIntegrationService.notifyShippingFailed(
          item.shippingId,
          routeId,
        );
      }
    }

    return {
      routeId,
      trackingCreated: input.length,
    };
  }
}
