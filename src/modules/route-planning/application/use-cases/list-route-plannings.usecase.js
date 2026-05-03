import { routePlanningListOutput } from '../dto/route-planning.output.js';

export class ListRoutePlanningsUseCase {
  constructor(routePlanningRepository) {
    this.routePlanningRepository = routePlanningRepository;
  }

  async execute(filters) {
    const items = await this.routePlanningRepository.listRoutePlannings(filters);

    return routePlanningListOutput(items);
  }
}
