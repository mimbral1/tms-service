import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { generateId } from '../../../../shared/utils/id.util.js';
import { Vehicle } from '../../domain/Vehicle.js';
import { vehicleOutput } from '../dto/vehicle.output.js';

export class CreateVehicleUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(input) {
    const vehicleType = await this.vehicleRepository.findVehicleTypeById(
      input.vehicleTypeId,
    );

    if (!vehicleType) {
      throw new NotFoundError('Vehicle type not found');
    }

    const vehicle = new Vehicle({
      id: generateId(),
      ...input,
    });

    const created = await this.vehicleRepository.createVehicle(vehicle);

    return vehicleOutput(created);
  }
}
