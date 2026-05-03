import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { InvalidRouteDispatchError } from './RouteDispatchErrors.js';
import { RouteDispatchStatus } from './RouteDispatchStatus.js';
import { assertRouteDispatchTransition } from './RouteDispatchStateMachine.js';

export class RouteDispatch extends AggregateRoot {
  constructor({
    id,
    routeId,
    warehouseId,
    routeDisplayId,
    dispatchDate,
    dispatcherId,
    dispatchStartTime,
    dispatchEndTime,
    dispatchDuration,
    dispatchToken,
    signature,
    status,
    packages,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!routeId) {
      throw new InvalidRouteDispatchError('routeId is required');
    }

    if (!warehouseId) {
      throw new InvalidRouteDispatchError('warehouseId is required');
    }

    if (!routeDisplayId) {
      throw new InvalidRouteDispatchError('routeDisplayId is required');
    }

    this.routeId = routeId;
    this.warehouseId = warehouseId;
    this.routeDisplayId = routeDisplayId;
    this.dispatchDate = dispatchDate || null;
    this.dispatcherId = dispatcherId || null;
    this.dispatchStartTime = dispatchStartTime || null;
    this.dispatchEndTime = dispatchEndTime || null;
    this.dispatchDuration = dispatchDuration || null;
    this.dispatchToken = dispatchToken || null;
    this.signature = signature || null;
    this.status = status || RouteDispatchStatus.PENDING;
    this.packages = packages || [];
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  markReady() {
    assertRouteDispatchTransition(
      this.status,
      RouteDispatchStatus.READY_FOR_DISPATCH,
    );

    this.status = RouteDispatchStatus.READY_FOR_DISPATCH;

    this.addDomainEvent({
      eventType: 'route_dispatch.ready',
      aggregateId: this.id,
      payload: {
        routeDispatchId: this.id,
        routeId: this.routeId,
        warehouseId: this.warehouseId,
        status: this.status,
      },
    });
  }

  start({ dispatcherId }) {
    assertRouteDispatchTransition(
      this.status,
      RouteDispatchStatus.PREPARING_FOR_DISPATCH,
    );

    this.status = RouteDispatchStatus.PREPARING_FOR_DISPATCH;
    this.dispatcherId = dispatcherId || null;
    this.dispatchStartTime = new Date();

    this.addDomainEvent({
      eventType: 'route_dispatch.started',
      aggregateId: this.id,
      payload: {
        routeDispatchId: this.id,
        routeId: this.routeId,
        warehouseId: this.warehouseId,
        dispatcherId: this.dispatcherId,
        status: this.status,
      },
    });
  }

  finish({ packages, signature, dispatchToken }) {
    assertRouteDispatchTransition(this.status, RouteDispatchStatus.DISPATCHED);

    this.status = RouteDispatchStatus.DISPATCHED;
    this.packages = packages || [];
    this.signature = signature || null;
    this.dispatchToken = dispatchToken;
    this.dispatchEndTime = new Date();

    if (this.dispatchStartTime) {
      this.dispatchDuration = Math.round(
        (this.dispatchEndTime.getTime() -
          new Date(this.dispatchStartTime).getTime()) /
          60000,
      );
    }

    this.addDomainEvent({
      eventType: 'route_dispatch.finished',
      aggregateId: this.id,
      payload: {
        routeDispatchId: this.id,
        routeId: this.routeId,
        warehouseId: this.warehouseId,
        dispatchToken: this.dispatchToken,
        status: this.status,
      },
    });
  }

  markNotDispatched(reason = null) {
    assertRouteDispatchTransition(
      this.status,
      RouteDispatchStatus.NOT_DISPATCHED,
    );

    this.status = RouteDispatchStatus.NOT_DISPATCHED;

    this.addDomainEvent({
      eventType: 'route_dispatch.not_dispatched',
      aggregateId: this.id,
      payload: {
        routeDispatchId: this.id,
        routeId: this.routeId,
        warehouseId: this.warehouseId,
        reason,
        status: this.status,
      },
    });
  }
}
