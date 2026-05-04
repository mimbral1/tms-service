import { Router } from 'express';
import { env } from '../../config/env.config.js';
import { checkSqlServerConnection } from '../../infrastructure/database/sqlserver.connection.js';
import { checkKafkaProducerConnection } from '../../infrastructure/kafka/kafka.producer.js';

export function HealthRoutes() {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      success: true,
      service: env.serviceName,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/live', (_req, res) => {
    res.json({
      success: true,
      service: env.serviceName,
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/ready', async (_req, res) => {
    const database = env.bootstrap.skipDatabase
      ? {
          success: true,
          status: 'skipped',
        }
      : await checkSqlServerConnection();

    const kafka = env.bootstrap.skipKafka
      ? {
          success: true,
          status: 'skipped',
        }
      : await checkKafkaProducerConnection();

    const ready = database.success && kafka.success;

    res.status(ready ? 200 : 503).json({
      success: ready,
      service: env.serviceName,
      status: ready ? 'ready' : 'not_ready',
      checks: {
        database,
        kafka,
      },
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}