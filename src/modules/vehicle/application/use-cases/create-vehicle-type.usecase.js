import { generateId } from '../../../../shared/utils/id.util.js';
import { VehicleType } from '../../domain/VehicleType.js';
import { vehicleTypeOutput } from '../dto/vehicle-type.output.js';

export class CreateVehicleTypeUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(input) {
    const vehicleType = new VehicleType({
      id: generateId(),
      ...input,
    });

    const created = await this.vehicleRepository.createVehicleType(vehicleType);

    return vehicleTypeOutput(created);
  }
}
