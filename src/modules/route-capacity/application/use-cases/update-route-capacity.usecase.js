import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { RouteCapacity } from '../../domain/RouteCapacity.js';
import { routeCapacityOutput } from '../dto/route-capacity.output.js';

export class UpdateRouteCapacityUseCase {
  constructor(routeCapacityRepository) {
    this.routeCapacityRepository = routeCapacityRepository;
  }

  async execute(id, input) {
    const current = await this.routeCapacityRepository.findRouteCapacityById(id);

    if (!current) {
      throw new NotFoundError('Route capacity not found');
    }

    const routeCapacity = new RouteCapacity({
      id,
      ...input,
      dateCreated: current.dateCreated,
    });

    const updated = await this.routeCapacityRepository.updateRouteCapacity(
      routeCapacity,
    );

    return routeCapacityOutput(updated);
  }
}
