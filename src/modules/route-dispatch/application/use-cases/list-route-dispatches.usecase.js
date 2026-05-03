import { routeDispatchListOutput } from '../dto/route-dispatch.output.js';

export class ListRouteDispatchesUseCase {
  constructor(routeDispatchRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
  }

  async execute(filters) {
    const items = await this.routeDispatchRepository.listRouteDispatches(filters);

    return routeDispatchListOutput(items);
  }
}
