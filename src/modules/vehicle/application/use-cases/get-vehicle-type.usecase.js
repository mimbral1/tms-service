import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { vehicleTypeOutput } from '../dto/vehicle-type.output.js';

export class GetVehicleTypeUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(id) {
    const vehicleType = await this.vehicleRepository.findVehicleTypeById(id);

    if (!vehicleType) {
      throw new NotFoundError('Vehicle type not found');
    }

    return vehicleTypeOutput(vehicleType);
  }
}
