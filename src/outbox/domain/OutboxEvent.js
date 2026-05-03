import { generateId } from '../../shared/utils/id.util.js';
import { OutboxStatus } from './OutboxStatus.js';

export class OutboxEvent {
  constructor({
    id,
    topic,
    eventType,
    aggregateId,
    payload,
    status,
    retryCount,
    lastError,
    processingStartedAt,
    publishedAt,
    dateCreated,
  }) {
    this.id = id;
    this.topic = topic;
    this.eventType = eventType;
    this.aggregateId = aggregateId || null;
    this.payload = payload;
    this.status = status || OutboxStatus.PENDING;
    this.retryCount = retryCount || 0;
    this.lastError = lastError || null;
    this.processingStartedAt = processingStartedAt || null;
    this.publishedAt = publishedAt || null;
    this.dateCreated = dateCreated || new Date();
  }

  static create({ topic, eventType, aggregateId, payload }) {
    return new OutboxEvent({
      id: generateId(),
      topic,
      eventType,
      aggregateId,
      payload,
      status: OutboxStatus.PENDING,
      retryCount: 0,
      dateCreated: new Date(),
    });
  }
}
