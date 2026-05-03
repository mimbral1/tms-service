import { Entity } from './Entity.js';

export class AggregateRoot extends Entity {
  constructor(id) {
    super(id);
    this.domainEvents = [];
  }

  addDomainEvent(event) {
    this.domainEvents.push(event);
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }

  pullDomainEvents() {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }
}
