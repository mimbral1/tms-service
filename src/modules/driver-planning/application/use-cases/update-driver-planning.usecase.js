import { driverPlanningOutput } from '../dto/driver-planning.output.js';
import { DriverPlanning } from '../../domain/DriverPlanning.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';

export class UpdateDriverPlanningUseCase {
  constructor(driverPlanningRepository, driverRepository) {
    this.driverPlanningRepository = driverPlanningRepository;
    this.driverRepository = driverRepository;
  }

  async execute(id, input) {
    const current = await this.driverPlanningRepository.findDriverPlanningById(id);

    if (!current) {
      throw new NotFoundError('Driver planning not found');
    }

    const driver = await this.driverRepository.findDriverById(input.driverId);

    if (!driver) {
      throw new NotFoundError('Driver not found');
    }

    const driverPlanning = new DriverPlanning({
      id,
      ...input,
      dateCreated: current.dateCreated,
    });

    const updated = await this.driverPlanningRepository.updateDriverPlanning(
      driverPlanning,
    );

    return driverPlanningOutput(updated);
  }
}
