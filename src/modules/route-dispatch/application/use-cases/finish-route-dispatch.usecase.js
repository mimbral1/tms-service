import { TMS_ROUTE_DISPATCH_FINISHED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routeDispatchIntegrationService } from '../../route-dispatch-integration.service.js';
import { routeDispatchOutput } from '../dto/route-dispatch.output.js';

function generateDispatchToken() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export class FinishRouteDispatchUseCase {
  constructor(routeDispatchRepository, outboxRepository) {
    this.routeDispatchRepository = routeDispatchRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(id, input) {
    const dispatch = await this.routeDispatchRepository.findRouteDispatchById(id);

    if (!dispatch) {
      throw new NotFoundError('Route dispatch not found');
    }

    const dispatchToken = generateDispatchToken();

    dispatch.finish({
      packages: input.packages,
      signature: input.signature,
      dispatchToken,
    });

    const updated = await this.routeDispatchRepository.updateRouteDispatch(dispatch);
    const output = {
      ...routeDispatchOutput(updated),
      packages: input.packages,
    };

    await routeDispatchIntegrationService.notifyDispatchFinished(output);
    await routeDispatchIntegrationService.generateManifest(output);

    for (const event of dispatch.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_DISPATCH_FINISHED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return output;
  }
}
