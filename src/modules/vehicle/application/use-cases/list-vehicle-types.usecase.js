import { vehicleTypeListOutput } from '../dto/vehicle-type.output.js';

export class ListVehicleTypesUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(filters) {
    const vehicleTypes = await this.vehicleRepository.listVehicleTypes(filters);

    return vehicleTypeListOutput(vehicleTypes);
  }
}
