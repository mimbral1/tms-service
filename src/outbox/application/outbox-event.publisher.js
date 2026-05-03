import { publishKafkaMessage } from '../../infrastructure/kafka/kafka.producer.js';

function readOutboxValue(event, pascalKey, camelKey) {
  return event[pascalKey] ?? event[camelKey];
}

export async function publishOutboxEvent(event) {
  const payloadJson = readOutboxValue(event, 'PayloadJson', 'payloadJson');
  const payload =
    typeof payloadJson === 'string'
      ? JSON.parse(payloadJson)
      : readOutboxValue(event, 'Payload', 'payload');

  await publishKafkaMessage(readOutboxValue(event, 'Topic', 'topic'), {
    id: readOutboxValue(event, 'Id', 'id'),
    eventType: readOutboxValue(event, 'EventType', 'eventType'),
    aggregateId: readOutboxValue(event, 'AggregateId', 'aggregateId'),
    payload,
    occurredAt: readOutboxValue(event, 'DateCreated', 'dateCreated'),
    service: 'tms-service',
  });
}

export class OutboxEventPublisher {
  async publish(event) {
    await publishOutboxEvent(event);
  }
}
