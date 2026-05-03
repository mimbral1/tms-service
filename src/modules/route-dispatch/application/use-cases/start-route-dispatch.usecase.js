import { TMS_ROUTE_DISPATCH_STARTED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeDispatchIntegrationService } from '../../route-dispatch-integration.service.js';
import { routeDispatchOutput } from '../dto/route-dispatch.output.js';

export class StartRouteDispatchUseCase {
  constructor(routeDispatchRepository, outboxRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(id, input) {
    const dispatch = await this.routeDispatchRepository.findRouteDispatchById(id);

    if (!dispatch) {
      throw new NotFoundError('Route dispatch not found');
    }

    dispatch.start({
      dispatcherId: input.dispatcherId,
    });

    const updated = await this.routeDispatchRepository.updateRouteDispatch(dispatch);
    const output = routeDispatchOutput(updated);

    await routeDispatchIntegrationService.notifyDispatchStarted(output);

    for (const event of dispatch.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_DISPATCH_STARTED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return output;
  }
}
