import { TMS_ROUTE_PLANNING_ROUTES_CREATED } from '../../../../infrastructure/kafka/kafka.topics.js';
import { OutboxEvent } from '../../../../outbox/domain/OutboxEvent.js';
import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class ConfirmRoutePlanningUseCase {
  constructor({ routePlanningRepository, outboxRepository, createRouteUseCase }) {
    this.routePlanningRepository = routePlanningRepository;
    this.outboxRepository = outboxRepository;
    this.createRouteUseCase = createRouteUseCase;
  }

  async execute(id, input) {
    const routePlanning = await this.routePlanningRepository.findRoutePlanningById(id);

    if (!routePlanning) {
      throw new NotFoundError('Route planning not found');
    }

    if (routePlanning.status !== 'pendingConfirmation') {
      throw new ValidationError('Route planning must be pendingConfirmation');
    }

    if (input.routes) {
      await this.routePlanningRepository.savePlannedRoutes(id, input.routes);
    }

    if (!input.routingConfirmed) {
      return {
        routePlanningId: id,
        message: 'Routes updated but not confirmed',
      };
    }

    routePlanning.markCreatingRoutes();

    await this.routePlanningRepository.updateRoutePlanning(routePlanning);

    const plannedRoutes = await this.routePlanningRepository.listPlannedRoutes(id);

    const created = [];
    const failed = [];

    for (const plannedRoute of plannedRoutes) {
      try {
        const route = await this.createRouteUseCase.execute({
          displayId: null,
          routePlanningId: routePlanning.id,
          vehicleTypeId: plannedRoute.vehicleTypeId,
          driverId: plannedRoute.driverId,
          scheduleStart: routePlanning.scheduleFrom,
          scheduleEnd: routePlanning.scheduleTo,
          autoSchedule: true,
          stops: plannedRoute.stops,
        });

        await this.routePlanningRepository.markPlannedRouteCreated(
          plannedRoute.id,
          route.id,
        );

        created.push({
          plannedRouteId: plannedRoute.id,
          routeId: route.id,
        });
      } catch (error) {
        failed.push({
          plannedRouteId: plannedRoute.id,
          errorMessage: error.message,
        });
      }
    }

    routePlanning.markRoutesCreated({
      created,
      failed,
    });

    const updated = await this.routePlanningRepository.updateRoutePlanning(
      routePlanning,
    );

    for (const event of routePlanning.pullDomainEvents()) {
      await this.outboxRepository.create(
        OutboxEvent.create({
          topic: TMS_ROUTE_PLANNING_ROUTES_CREATED,
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          payload: event.payload,
        }),
      );
    }

    return {
      routePlanningId: updated.id,
      status: updated.status,
      created,
      failed,
    };
  }
}
