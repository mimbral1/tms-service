import { generateDisplayId, generateId } from '../../../../shared/utils/id.util.js';
import { RoutePlanning } from '../../domain/RoutePlanning.js';
import { routePlanningOutput } from '../dto/route-planning.output.js';

export class CreateRoutePlanningUseCase {
  constructor(routePlanningRepository) {
    this.routePlanningRepository = routePlanningRepository;
  }

  async execute(input) {
    const routePlanning = new RoutePlanning({
      id: generateId(),
      displayId: generateDisplayId('RPL'),
      ...input,
    });

    const created = await this.routePlanningRepository.createRoutePlanning(
      routePlanning,
    );

    return routePlanningOutput(created);
  }
}
