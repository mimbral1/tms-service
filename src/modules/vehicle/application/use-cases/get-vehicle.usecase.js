import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { vehicleOutput } from '../dto/vehicle.output.js';

export class GetVehicleUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(id) {
    const vehicle = await this.vehicleRepository.findVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    return vehicleOutput(vehicle);
  }
}
