import { TMS_ROUTE_DRIVER_ASSIGNED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeOutput } from '../dto/route.output.js';

export class AssignDriverUseCase {
  constructor(routeRepository, driverRepository, outboxRepository) {
    this.routeRepository = routeRepository;
    this.driverRepository = driverRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(routeId, input) {
    const route = await this.routeRepository.findRouteById(routeId);
    if (!route) throw new NotFoundError('Route not found');

    const driver = await this.driverRepository.findDriverById(input.driverId);
    if (!driver) throw new NotFoundError('Driver not found');

    route.assignDriver(input.driverId);

    const updated = await this.routeRepository.updateRoute(route);

    for (const event of route.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_DRIVER_ASSIGNED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return routeOutput(updated);
  }
}
