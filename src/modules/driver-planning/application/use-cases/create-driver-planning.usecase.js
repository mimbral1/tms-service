import { driverPlanningListOutput } from '../dto/driver-planning.output.js';
import { DriverPlanning } from '../../domain/DriverPlanning.js';
import { generateId } from '../../../../shared/utils/id.util.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';

export class CreateDriverPlanningUseCase {
  constructor(driverPlanningRepository, driverRepository) {
    this.driverPlanningRepository = driverPlanningRepository;
    this.driverRepository = driverRepository;
  }

  async execute(input) {
    const created = [];

    for (const driverId of input.driverIds) {
      const driver = await this.driverRepository.findDriverById(driverId);

      if (!driver) {
        throw new NotFoundError(`Driver not found: ${driverId}`);
      }

      for (const timeSlot of input.timeSlots) {
        const driverPlanning = new DriverPlanning({
          id: generateId(),
          driverId,
          warehouseIds: input.warehouseIds,
          availability: timeSlot.availability,
          dateStart: timeSlot.dateRange.from,
          dateEnd: timeSlot.dateRange.to,
          motiveId: timeSlot.motiveId || null,
          comment: timeSlot.comment || null,
          userCreated: input.userCreated,
        });

        const result = await this.driverPlanningRepository.createDriverPlanning(
          driverPlanning,
        );

        created.push(result);
      }
    }

    return driverPlanningListOutput(created);
  }
}
