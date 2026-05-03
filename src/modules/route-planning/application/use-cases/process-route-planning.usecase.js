import { TMS_ROUTE_PLANNING_PROCESSED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { routePlanningOutput } from '../dto/route-planning.output.js';
import { routePlanningOptimizerService } from '../services/route-planning-optimizer.service.js';

export class ProcessRoutePlanningUseCase {
  constructor(routePlanningRepository, outboxRepository) {
    this.routePlanningRepository = routePlanningRepository;
    this.outboxRepository = outboxRepository;
  }

  async execute(id) {
    const routePlanning = await this.routePlanningRepository.findRoutePlanningById(id);

    if (!routePlanning) {
      throw new NotFoundError('Route planning not found');
    }

    const result = routePlanningOptimizerService.generateInitialPlan(routePlanning);

    await this.routePlanningRepository.savePlannedRoutes(id, result.routes);

    routePlanning.markProcessed(result.totals);

    const updated = await this.routePlanningRepository.updateRoutePlanning(
      routePlanning,
    );

    for (const event of routePlanning.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_PLANNING_PROCESSED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return routePlanningOutput(updated);
  }
}
