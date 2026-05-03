import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { DriverAvailability } from './DriverAvailability.js';
import { InvalidDriverError } from './DriverErrors.js';

export class Driver extends AggregateRoot {
  constructor({
    id,
    userId,
    firstname,
    lastname,
    email,
    documentNumber,
    employeeId,
    activeWarehouseId,
    warehouseIds,
    status,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!firstname) throw new InvalidDriverError('Driver firstname is required');
    if (!lastname) throw new InvalidDriverError('Driver lastname is required');
    if (!email) throw new InvalidDriverError('Driver email is required');

    this.userId = userId || null;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.documentNumber = documentNumber || null;
    this.employeeId = employeeId || null;
    this.activeWarehouseId = activeWarehouseId || null;
    this.warehouseIds = warehouseIds || [];
    this.status = status || DriverAvailability.ACTIVE;
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  getFullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  activate() {
    this.status = DriverAvailability.ACTIVE;
  }

  deactivate() {
    this.status = DriverAvailability.INACTIVE;
  }

  assignWarehouses(warehouseIds) {
    this.warehouseIds = warehouseIds || [];
    this.activeWarehouseId = this.warehouseIds[0] || null;
  }
}
