import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { InvalidRoutePlanningError } from './RoutePlanningErrors.js';
import { RoutePlanningStatus } from './RoutePlanningStatus.js';
import { assertRoutePlanningTransition } from './RoutePlanningStateMachine.js';

export class RoutePlanning extends AggregateRoot {
  constructor({
    id,
    displayId,
    scheduleFrom,
    scheduleTo,
    onlyShippingsReadyForPickup,
    status,
    planningConditions,
    totals,
    errorMessage,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!displayId) {
      throw new InvalidRoutePlanningError('displayId is required');
    }

    if (!scheduleFrom || !scheduleTo) {
      throw new InvalidRoutePlanningError('Schedule range is required');
    }

    if (new Date(scheduleFrom).getTime() >= new Date(scheduleTo).getTime()) {
      throw new InvalidRoutePlanningError('scheduleFrom must be lower than scheduleTo');
    }

    this.displayId = displayId;
    this.scheduleFrom = scheduleFrom;
    this.scheduleTo = scheduleTo;
    this.onlyShippingsReadyForPickup = onlyShippingsReadyForPickup ?? null;
    this.status = status || RoutePlanningStatus.PROCESSING;
    this.planningConditions = planningConditions || [];
    this.totals = totals || {
      warehouseCount: 0,
      vehicleTypeCount: 0,
      routeCount: 0,
      shippingCount: 0,
      assignedShippingCount: 0,
      unassignedShippingCount: 0,
    };
    this.errorMessage = errorMessage || null;
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  markProcessed(totals) {
    assertRoutePlanningTransition(
      this.status,
      RoutePlanningStatus.PENDING_CONFIRMATION,
    );

    this.status = RoutePlanningStatus.PENDING_CONFIRMATION;
    this.totals = totals;

    this.addDomainEvent({
      eventType: 'route_planning.processed',
      aggregateId: this.id,
      payload: {
        routePlanningId: this.id,
        displayId: this.displayId,
        status: this.status,
        totals,
      },
    });
  }

  markCreatingRoutes() {
    assertRoutePlanningTransition(this.status, RoutePlanningStatus.CREATING_ROUTES);

    this.status = RoutePlanningStatus.CREATING_ROUTES;
  }

  markRoutesCreated({ created, failed }) {
    let nextStatus = RoutePlanningStatus.ROUTES_CREATED;

    if (created.length > 0 && failed.length > 0) {
      nextStatus = RoutePlanningStatus.ROUTES_PARTIALLY_CREATED;
    }

    if (created.length === 0 && failed.length > 0) {
      nextStatus = RoutePlanningStatus.ROUTE_CREATION_FAILED;
    }

    assertRoutePlanningTransition(this.status, nextStatus);

    this.status = nextStatus;

    this.addDomainEvent({
      eventType: 'route_planning.routes_created',
      aggregateId: this.id,
      payload: {
        routePlanningId: this.id,
        displayId: this.displayId,
        status: this.status,
        created,
        failed,
      },
    });
  }
}
