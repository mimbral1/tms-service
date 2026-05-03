import { createApp } from './app.js';
import { bootstrapDatabase } from './bootstrap/database.bootstrap.js';
import { bootstrapKafka } from './bootstrap/kafka.bootstrap.js';
import { bootstrapJobs } from './bootstrap/jobs.bootstrap.js';
import { bootstrapListeners } from './bootstrap/listeners.bootstrap.js';
import { env } from './config/env.config.js';
import { logger } from './config/logger.config.js';

async function startServer() {
  try {
    if (!env.bootstrap.skipDatabase) {
      await bootstrapDatabase();
    } else {
      logger.warn('Database bootstrap skipped');
    }

    if (!env.bootstrap.skipKafka) {
      await bootstrapKafka();
    } else {
      logger.warn('Kafka bootstrap skipped');
    }

    if (!env.bootstrap.skipJobs) {
      bootstrapJobs();
    } else {
      logger.warn('Jobs bootstrap skipped');
    }

    if (env.nodeEnv !== 'test' && !env.bootstrap.skipListeners) {
      await bootstrapListeners();
    } else {
      logger.warn('Listeners bootstrap skipped');
    }

    const app = createApp();

    app.listen(env.port, () => {
      logger.info(`${env.serviceName} running on port ${env.port}`);
    });
  } catch (error) {
    logger.error('TMS Service failed to start', { error });
    process.exit(1);
  }
}

startServer();
