import { Entity } from '../../../shared/domain/Entity.js';

export class RouteStop extends Entity {
  constructor({
    id,
    kind,
    warehouseId,
    address,
    latitude,
    longitude,
    position,
    actions,
  }) {
    super(id);

    if (!kind) throw new Error('Route stop kind is required');
    if (!address) throw new Error('Route stop address is required');

    this.kind = kind;
    this.warehouseId = warehouseId || null;
    this.address = address;
    this.latitude = latitude ?? null;
    this.longitude = longitude ?? null;
    this.position = position;
    this.actions = actions || [];
  }
}
