import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { DriverPlanningStatus } from './DriverPlanningStatus.js';
import { InvalidDriverPlanningError } from './DriverPlanningErrors.js';

export class DriverPlanning extends AggregateRoot {
  constructor({
    id,
    driverId,
    warehouseIds,
    availability,
    dateStart,
    dateEnd,
    motiveId,
    comment,
    routeId,
    isFinished,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!driverId) {
      throw new InvalidDriverPlanningError('Driver id is required');
    }

    if (!availability) {
      throw new InvalidDriverPlanningError('Availability is required');
    }

    if (!dateStart || !dateEnd) {
      throw new InvalidDriverPlanningError('Date range is required');
    }

    if (new Date(dateStart).getTime() >= new Date(dateEnd).getTime()) {
      throw new InvalidDriverPlanningError('dateStart must be lower than dateEnd');
    }

    if (availability === DriverPlanningStatus.NOT_AVAILABLE && !motiveId) {
      throw new InvalidDriverPlanningError(
        'motiveId is required when availability is notAvailable',
      );
    }

    this.driverId = driverId;
    this.warehouseIds = warehouseIds || [];
    this.availability = availability;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.motiveId = motiveId || null;
    this.comment = comment || null;
    this.routeId = routeId || null;
    this.isFinished = Boolean(isFinished);
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  finish() {
    this.isFinished = true;
  }

  assignRoute(routeId) {
    this.routeId = routeId;
    this.availability = DriverPlanningStatus.OCCUPIED;
  }
}
