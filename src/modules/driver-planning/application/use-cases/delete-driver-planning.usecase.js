import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';

export class DeleteDriverPlanningUseCase {
  constructor(driverPlanningRepository) {
    this.driverPlanningRepository = driverPlanningRepository;
  }

  async execute(id) {
    const current = await this.driverPlanningRepository.findDriverPlanningById(id);

    if (!current) {
      throw new NotFoundError('Driver planning not found');
    }

    return this.driverPlanningRepository.deleteDriverPlanning(id);
  }
}
