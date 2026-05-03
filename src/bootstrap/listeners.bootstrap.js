import { logger } from '../config/logger.config.js';
import { startKafkaListeners } from '../listeners/index.js';

export async function bootstrapListeners() {
  await startKafkaListeners();
  logger.info('Listeners bootstrap completed');
}
