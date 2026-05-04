import { AppError } from '../errors/AppError.js';
import { env } from '../../config/env.config.js';

export function authMiddleware(req, _res, next) {
  const apiKey = req.headers['x-api-key'];
  const userId = req.headers['x-user-id'];

  const isDevelopment = env.nodeEnv === 'development';
  const configuredApiKey = env.auth.internalApiKey;

  if (!isDevelopment && !configuredApiKey) {
    throw new AppError('Internal API key is not configured', {
      statusCode: 500,
      code: 'INTERNAL_API_KEY_NOT_CONFIGURED',
    });
  }

  if (!isDevelopment && !apiKey) {
    throw new AppError('Missing x-api-key header', {
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  if (!isDevelopment && apiKey !== configuredApiKey) {
    throw new AppError('Invalid x-api-key header', {
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  }

  req.user = {
    id: userId || 'system',
    apiKey: apiKey || 'development',
  };

  next();
}