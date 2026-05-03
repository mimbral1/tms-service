import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeCapacityOutput } from '../dto/route-capacity.output.js';

export class GetRouteCapacityUseCase {
  constructor(routeCapacityRepository) {
    this.routeCapacityRepository = routeCapacityRepository;
  }

  async execute(id) {
    const current = await this.routeCapacityRepository.findRouteCapacityById(id);

    if (!current) {
      throw new NotFoundError('Route capacity not found');
    }

    return routeCapacityOutput(current);
  }
}
