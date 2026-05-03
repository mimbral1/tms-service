import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { RouteStatus } from './RouteStatus.js';
import { assertRouteTransition } from './RouteStateMachine.js';
import { InvalidRouteError } from './RouteErrors.js';

export class Route extends AggregateRoot {
  constructor({
    id,
    displayId,
    companyId,
    driverId,
    vehicleId,
    vehicleTypeId,
    routePlanningId,
    scheduleStart,
    scheduleEnd,
    autoSchedule,
    status,
    dateStarted,
    dateFinished,
    originLat,
    originLng,
    stops,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!displayId) throw new InvalidRouteError('Route displayId is required');

    this.displayId = displayId;
    this.companyId = companyId || null;
    this.driverId = driverId || null;
    this.vehicleId = vehicleId || null;
    this.vehicleTypeId = vehicleTypeId || null;
    this.routePlanningId = routePlanningId || null;
    this.scheduleStart = scheduleStart || null;
    this.scheduleEnd = scheduleEnd || null;
    this.autoSchedule = autoSchedule !== false;
    this.status = status || RouteStatus.CREATED;
    this.dateStarted = dateStarted || null;
    this.dateFinished = dateFinished || null;
    this.originLat = originLat ?? null;
    this.originLng = originLng ?? null;
    this.stops = stops || [];
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  assignDriver(driverId) {
    if (!driverId) {
      throw new InvalidRouteError('driverId is required');
    }

    this.driverId = driverId;

    this.addDomainEvent({
      eventType: 'route.driver_assigned',
      aggregateId: this.id,
      payload: {
        routeId: this.id,
        driverId,
      },
    });
  }

  start(coordinates = null) {
    assertRouteTransition(this.status, RouteStatus.STARTED);

    this.status = RouteStatus.STARTED;
    this.dateStarted = new Date();

    if (coordinates) {
      this.originLat = coordinates.lat;
      this.originLng = coordinates.lng;
    }

    this.addDomainEvent({
      eventType: 'route.started',
      aggregateId: this.id,
      payload: {
        routeId: this.id,
        displayId: this.displayId,
        coordinates,
      },
    });
  }

  finish() {
    assertRouteTransition(this.status, RouteStatus.FINISHED);

    this.status = RouteStatus.FINISHED;
    this.dateFinished = new Date();

    this.addDomainEvent({
      eventType: 'route.finished',
      aggregateId: this.id,
      payload: {
        routeId: this.id,
        displayId: this.displayId,
      },
    });
  }

  cancel(reason = null) {
    assertRouteTransition(this.status, RouteStatus.CANCELLED);

    this.status = RouteStatus.CANCELLED;

    this.addDomainEvent({
      eventType: 'route.cancelled',
      aggregateId: this.id,
      payload: {
        routeId: this.id,
        displayId: this.displayId,
        reason,
      },
    });
  }
}
