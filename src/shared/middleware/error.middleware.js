import { logger } from '../../config/logger.config.js';

export function errorMiddleware(error, req, res, _next) {
  const statusCode = error.statusCode ?? 500;

  logger.error('Request failed', {
    requestId: req.requestId,
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    },
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: statusCode === 500 ? 'Internal server error' : error.message,
      details: error.details ?? null,
    },
    requestId: req.requestId,
  });
}
