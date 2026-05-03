import { TMS_ROUTE_CANCELLED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeOutput } from '../dto/route.output.js';

export class CancelRouteUseCase {
  constructor(routeRepository, outboxRepository) {
    this.routeRepository = routeRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(routeId, input) {
    const route = await this.routeRepository.findRouteById(routeId);
    if (!route) throw new NotFoundError('Route not found');

    route.cancel(input.reason || input.comment || null);

    const updated = await this.routeRepository.updateRoute(route);

    for (const event of route.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_CANCELLED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return routeOutput(updated);
  }
}
