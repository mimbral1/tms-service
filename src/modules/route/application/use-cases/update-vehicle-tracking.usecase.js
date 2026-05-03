import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class UpdateVehicleTrackingUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(routeId, input) {
    const route = await this.routeRepository.findRouteById(routeId);
    if (!route) throw new NotFoundError('Route not found');

    if (route.status !== 'started') {
      throw new ValidationError('Route must be started to update vehicle tracking');
    }

    const points = Array.isArray(input) ? input : [input];

    for (const point of points) {
      await this.routeRepository.createVehicleTracking(routeId, point);
    }

    return {
      routeId,
      pointsCreated: points.length,
    };
  }
}
