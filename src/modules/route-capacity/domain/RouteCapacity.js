import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { InvalidRouteCapacityError } from './RouteCapacityErrors.js';

export class RouteCapacity extends AggregateRoot {
  constructor({
    id,
    name,
    warehouseId,
    shippingTypeId,
    vehicleTypeId,
    dayOfWeek,
    isActive,
    windows,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!name) throw new InvalidRouteCapacityError('name is required');
    if (!warehouseId) throw new InvalidRouteCapacityError('warehouseId is required');

    if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) {
      throw new InvalidRouteCapacityError('dayOfWeek must be between 1 and 7');
    }

    if (!windows || !windows.length) {
      throw new InvalidRouteCapacityError('At least one capacity window is required');
    }

    this.name = name;
    this.warehouseId = warehouseId;
    this.shippingTypeId = shippingTypeId || null;
    this.vehicleTypeId = vehicleTypeId || null;
    this.dayOfWeek = dayOfWeek;
    this.isActive = isActive !== false;
    this.windows = windows;
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}
