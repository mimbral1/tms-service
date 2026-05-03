import { generateId } from '../../../../shared/utils/id.util.js';
import { RouteCapacity } from '../../domain/RouteCapacity.js';
import { routeCapacityOutput } from '../dto/route-capacity.output.js';

export class CreateRouteCapacityUseCase {
  constructor(routeCapacityRepository) {
    this.routeCapacityRepository = routeCapacityRepository;
  }

  async execute(input) {
    const routeCapacity = new RouteCapacity({
      id: generateId(),
      ...input,
    });

    const created = await this.routeCapacityRepository.createRouteCapacity(
      routeCapacity,
    );

    return routeCapacityOutput(created);
  }
}
