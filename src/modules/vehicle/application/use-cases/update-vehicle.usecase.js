import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { Vehicle } from '../../domain/Vehicle.js';
import { vehicleOutput } from '../dto/vehicle.output.js';

export class UpdateVehicleUseCase {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async execute(vehicleId, input) {
    const current = await this.vehicleRepository.findVehicleById(vehicleId);

    if (!current) {
      throw new NotFoundError('Vehicle not found');
    }

    const vehicleType = await this.vehicleRepository.findVehicleTypeById(
      input.vehicleTypeId,
    );

    if (!vehicleType) {
      throw new NotFoundError('Vehicle type not found');
    }

    const vehicle = new Vehicle({
      ...current,
      ...input,
      id: vehicleId,
      lastKnownLatitude: current.lastKnownLatitude,
      lastKnownLongitude: current.lastKnownLongitude,
      lastKnownLocationDate: current.lastKnownLocationDate,
      dateCreated: current.dateCreated,
      userCreated: current.userCreated,
    });

    const updated = await this.vehicleRepository.updateVehicle(vehicle);

    return vehicleOutput(updated);
  }
}
