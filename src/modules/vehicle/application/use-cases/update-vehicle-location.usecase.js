import { withTransaction } from '../../../../infrastructure/database/sqlserver.transaction.js';
import { TMS_VEHICLE_LOCATION_UPDATED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { vehicleOutput } from '../dto/vehicle.output.js';

export class UpdateVehicleLocationUseCase {
  constructor(vehicleRepository, outboxRepository) {
    this.vehicleRepository = vehicleRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(vehicleId, input) {
    const vehicle = await this.vehicleRepository.findVehicleById(vehicleId);

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    vehicle.updateLocation(input);

    const updated = await withTransaction(async ({ transaction }) => {
      const updatedVehicle = await this.vehicleRepository.updateVehicleLocation(
        vehicle,
        transaction,
      );

      for (const event of vehicle.pullDomainEvents()) {
        await this.outboxRepository.create(
          OutboxEvent.create({
            topic: TMS_VEHICLE_LOCATION_UPDATED,
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            payload: event.payload,
          }),
          transaction,
        );
      }

      return updatedVehicle;
    });

    return vehicleOutput(updated);
  }
}