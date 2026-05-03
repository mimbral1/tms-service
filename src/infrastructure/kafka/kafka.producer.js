import { logger } from '../../config/logger.config.js';
import { kafka } from './kafka.client.js';
import { Partitioners } from 'kafkajs';

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

let connected = false;

export async function connectKafkaProducer() {
  if (connected) return producer;

  await producer.connect();
  connected = true;

  logger.info('Kafka producer connected');
  return producer;
}

export async function publishKafkaMessage(topic, message) {
  await connectKafkaProducer();

  await producer.send({
    topic,
    messages: [
      {
        key: message.aggregateId || message.id || null,
        value: JSON.stringify(message),
      },
    ],
  });

  logger.info('Kafka message published', {
    topic,
    aggregateId: message.aggregateId || null,
  });
}
