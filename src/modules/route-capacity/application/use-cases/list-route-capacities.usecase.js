import { routeCapacityListOutput } from '../dto/route-capacity.output.js';

export class ListRouteCapacitiesUseCase {
  constructor(routeCapacityRepository) {
    this.routeCapacityRepository = routeCapacityRepository;
  }

  async execute(filters) {
    const items = await this.routeCapacityRepository.listRouteCapacities(filters);

    return routeCapacityListOutput(items);
  }
}
