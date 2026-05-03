import { logger } from '../config/logger.config.js';
import { connectKafkaProducer } from '../infrastructure/kafka/kafka.producer.js';

export async function bootstrapKafka() {
  await connectKafkaProducer();
  logger.info('Kafka bootstrap completed');
}
