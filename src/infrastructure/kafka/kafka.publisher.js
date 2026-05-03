import { publishKafkaMessage } from './kafka.producer.js';

export async function publishDomainEvent(topic, event) {
  const message = {
    id: event.id,
    eventType: event.eventType,
    aggregateId: event.aggregateId,
    payload: event.payload,
    occurredAt: event.occurredAt || new Date().toISOString(),
    service: 'tms-service',
  };

  await publishKafkaMessage(topic, message);
}

export class KafkaPublisher {
  async publish(topic, event) {
    await publishDomainEvent(topic, event);
  }
}
