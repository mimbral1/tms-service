import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { generateDisplayId, generateId } from '../../../../shared/utils/id.util.js';
import { Route } from '../../domain/Route.js';
import { routeOutput } from '../dto/route.output.js';

export class CreateRouteUseCase {
  constructor(routeRepository, driverRepository, vehicleRepository) {
    this.routeRepository = routeRepository;
    this.driverRepository = driverRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async execute(input) {
    if (input.driverId) {
      const driver = await this.driverRepository.findDriverById(input.driverId);
      if (!driver) throw new NotFoundError('Driver not found');
    }

    if (input.vehicleId) {
      const vehicle = await this.vehicleRepository.findVehicleById(input.vehicleId);
      if (!vehicle) throw new NotFoundError('Vehicle not found');
    }

    const route = new Route({
      id: generateId(),
      displayId: input.displayId || generateDisplayId('RTE'),
      ...input,
    });

    const created = await this.routeRepository.createRoute(route);

    return routeOutput(created);
  }
}
