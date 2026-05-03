import { vehicleListOutput } from '../dto/vehicle.output.js';

export class ListVehiclesUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(filters) {
    const vehicles = await this.vehicleRepository.listVehicles(filters);

    return vehicleListOutput(vehicles);
  }
}
