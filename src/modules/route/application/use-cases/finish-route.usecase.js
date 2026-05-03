import { TMS_ROUTE_FINISHED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeOutput } from '../dto/route.output.js';

export class FinishRouteUseCase {
  constructor(routeRepository, outboxRepository, driverPlanningRepository) {
    this.routeRepository = routeRepository;
    this.outboxRepository = outboxRepository;
    this.driverPlanningRepository = driverPlanningRepository;
  }

  async execute(routeId) {
    const route = await this.routeRepository.findRouteById(routeId);
    if (!route) throw new NotFoundError('Route not found');

    route.finish();

    const updated = await this.routeRepository.updateRoute(route);

    if (this.driverPlanningRepository) {
      await this.driverPlanningRepository.markRouteFinished(routeId);
    }

    for (const event of route.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_FINISHED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return routeOutput(updated);
  }
}
