import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorMiddleware } from './shared/middleware/error.middleware.js';
import { requestIdMiddleware } from './shared/middleware/request-id.middleware.js';
import { apiRoutes } from './routes/index.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(requestIdMiddleware);

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      service: 'tms-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', apiRoutes());

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      },
      requestId: req.requestId,
    });
  });

  app.use(errorMiddleware);

  return app;
}
