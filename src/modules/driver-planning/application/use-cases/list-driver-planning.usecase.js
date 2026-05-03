import { driverPlanningListOutput } from '../dto/driver-planning.output.js';

export class ListDriverPlanningUseCase {
  constructor(driverPlanningRepository) {
    this.driverPlanningRepository = driverPlanningRepository;
  }

  async execute(filters) {
    const items = await this.driverPlanningRepository.listDriverPlannings(filters);

    return driverPlanningListOutput(items);
  }
}
