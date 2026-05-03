import { routeListOutput } from '../dto/route.output.js';

export class ListRoutesUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute(filters) {
    const routes = await this.routeRepository.listRoutes(filters);

    return routeListOutput(routes);
  }
}
