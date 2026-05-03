import { kafkaConfig } from '../../config/kafka.config.js';
import { logger } from '../../config/logger.config.js';
import { kafka } from './kafka.client.js';

export const consumer = kafka.consumer({
  groupId: kafkaConfig.groupId,
});

let connected = false;
let running = false;
const topicHandlers = new Map();

export async function connectKafkaConsumer() {
  if (connected) return consumer;

  await consumer.connect();
  connected = true;

  logger.info('Kafka consumer connected');
  return consumer;
}

export async function subscribeToTopic(topic, handler) {
  await connectKafkaConsumer();

  topicHandlers.set(topic, handler);

  await consumer.subscribe({
    topic,
    fromBeginning: false,
  });
}

export async function runKafkaConsumer() {
  if (running) return;

  await consumer.run({
    eachMessage: async ({ topic: messageTopic, partition, message }) => {
      try {
        const topicHandler = topicHandlers.get(messageTopic);

        if (!topicHandler) {
          logger.warn('Kafka message skipped without handler', {
            topic: messageTopic,
          });
          return;
        }

        const payload = JSON.parse(message.value.toString());

        await topicHandler(payload, {
          topic: messageTopic,
          partition,
          offset: message.offset,
        });
      } catch (error) {
        logger.error('Kafka message processing failed', {
          error,
          topic: messageTopic,
        });
      }
    },
  });

  running = true;
}
