import { Entity } from '../../../shared/domain/Entity.js';

export class VehicleType extends Entity {
  constructor({
    id,
    referenceId,
    name,
    type,
    maxShippingQuantity,
    maxProductQuantity,
    maxVolume,
    maxDistance,
    maxWeight,
    fuelConsumption,
    icon,
    companyId,
    status,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!name) throw new Error('Vehicle type name is required');
    if (!type) throw new Error('Vehicle type is required');

    this.referenceId = referenceId || null;
    this.name = name;
    this.type = type;
    this.maxShippingQuantity = maxShippingQuantity;
    this.maxProductQuantity = maxProductQuantity;
    this.maxVolume = maxVolume;
    this.maxDistance = maxDistance;
    this.maxWeight = maxWeight;
    this.fuelConsumption = fuelConsumption || null;
    this.icon = icon || null;
    this.companyId = companyId || null;
    this.status = status || 'active';
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }

  deactivate() {
    this.status = 'inactive';
  }

  activate() {
    this.status = 'active';
  }
}
