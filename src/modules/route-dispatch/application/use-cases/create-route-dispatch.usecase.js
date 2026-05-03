import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { generateId } from '../../../../shared/utils/id.util.js';
import { RouteDispatch } from '../../domain/RouteDispatch.js';
import { routeDispatchOutput } from '../dto/route-dispatch.output.js';

export class CreateRouteDispatchUseCase {
  constructor(routeDispatchRepository, routeRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
    this.routeRepository = routeRepository;
  }

  async execute(input) {
    const route = await this.routeRepository.findRouteById(input.routeId);

    if (!route) {
      throw new NotFoundError('Route not found');
    }

    const dispatch = new RouteDispatch({
      id: generateId(),
      ...input,
    });

    const created = await this.routeDispatchRepository.createRouteDispatch(dispatch);

    return routeDispatchOutput(created);
  }
}
