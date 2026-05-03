import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeOutput } from '../dto/route.output.js';

export class GetRouteUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(id) {
    const route = await this.routeRepository.findRouteById(id);

    if (!route) throw new NotFoundError('Route not found');

    return routeOutput(route);
  }
}
