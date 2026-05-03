import { Entity } from '../../../shared/domain/Entity.js';

export class RouteStopAction extends Entity {
  constructor({ id, shippingId, relatedShippingId, type, status }) {
    super(id);

    if (!type) {
      throw new Error('Route stop action type is required');
    }

    this.shippingId = shippingId || null;
    this.relatedShippingId = relatedShippingId || null;
    this.type = type;
    this.status = status || 'pending';
  }

  updateStatus(status) {
    this.status = status;
  }
}
