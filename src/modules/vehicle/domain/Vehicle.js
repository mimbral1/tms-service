import { AggregateRoot } from '../../../shared/domain/AggregateRoot.js';
import { VehicleStatus } from './VehicleStatus.js';
import { InvalidVehicleError } from './VehicleErrors.js';

export class Vehicle extends AggregateRoot {
  constructor({
    id,
    referenceId,
    name,
    companyId,
    plate,
    brand,
    model,
    year,
    capacity,
    vehicleTypeId,
    lastKnownLatitude,
    lastKnownLongitude,
    lastKnownLocationDate,
    status,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!name) throw new InvalidVehicleError('Vehicle name is required');
    if (!plate) throw new InvalidVehicleError('Vehicle plate is required');
    if (!brand) throw new InvalidVehicleError('Vehicle brand is required');
    if (!model) throw new InvalidVehicleError('Vehicle model is required');
    if (!vehicleTypeId) throw new InvalidVehicleError('Vehicle type is required');

    this.referenceId = referenceId || null;
    this.name = name;
    this.companyId = companyId || null;
    this.plate = plate;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.capacity = capacity;
    this.vehicleTypeId = vehicleTypeId;
    this.lastKnownLatitude = lastKnownLatitude ?? null;
    this.lastKnownLongitude = lastKnownLongitude ?? null;
    this.lastKnownLocationDate = lastKnownLocationDate || null;
    this.status = status || VehicleStatus.ACTIVE;
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  updateLocation({ latitude, longitude, date }) {
    if (latitude < -90 || latitude > 90) {
      throw new InvalidVehicleError('Invalid latitude');
    }

    if (longitude < -180 || longitude > 180) {
      throw new InvalidVehicleError('Invalid longitude');
    }

    this.lastKnownLatitude = latitude;
    this.lastKnownLongitude = longitude;
    this.lastKnownLocationDate = date || new Date();

    this.addDomainEvent({
      eventType: 'vehicle.location_updated',
      aggregateId: this.id,
      payload: {
        vehicleId: this.id,
        latitude,
        longitude,
        date: this.lastKnownLocationDate,
      },
    });
  }

  deactivate() {
    this.status = VehicleStatus.INACTIVE;
  }

  activate() {
    this.status = VehicleStatus.ACTIVE;
  }

  markAsError() {
    this.status = VehicleStatus.ERROR;
  }
}
