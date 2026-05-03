import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../../config/kafka.config.js';

export const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
});
