import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeDispatchOutput } from '../dto/route-dispatch.output.js';

export class GetRouteDispatchUseCase {
  constructor(routeDispatchRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
  }

  async execute(id) {
    const dispatch = await this.routeDispatchRepository.findRouteDispatchById(id);

    if (!dispatch) {
      throw new NotFoundError('Route dispatch not found');
    }

    return routeDispatchOutput(dispatch);
  }
}
