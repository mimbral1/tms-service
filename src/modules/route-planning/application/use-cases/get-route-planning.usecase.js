import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routePlanningOutput } from '../dto/route-planning.output.js';

export class GetRoutePlanningUseCase {
  constructor(routePlanningRepository) {
    this.routePlanningRepository = routePlanningRepository;
  }

  async execute(id) {
    const routePlanning = await this.routePlanningRepository.findRoutePlanningById(id);

    if (!routePlanning) {
      throw new NotFoundError('Route planning not found');
    }

    const plannedRoutes = await this.routePlanningRepository.listPlannedRoutes(id);

    return {
      ...routePlanningOutput(routePlanning),
      plannedRoutes,
    };
  }
}
