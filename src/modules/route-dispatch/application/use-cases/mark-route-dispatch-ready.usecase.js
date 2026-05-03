import { TMS_ROUTE_DISPATCH_READY } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeDispatchOutput } from '../dto/route-dispatch.output.js';

export class MarkRouteDispatchReadyUseCase {
  constructor(routeDispatchRepository, outboxRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(id) {
    const dispatch = await this.routeDispatchRepository.findRouteDispatchById(id);

    if (!dispatch) {
      throw new NotFoundError('Route dispatch not found');
    }

    dispatch.markReady();

    const updated = await this.routeDispatchRepository.updateRouteDispatch(dispatch);

    for (const event of dispatch.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_DISPATCH_READY,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return routeDispatchOutput(updated);
  }
}
