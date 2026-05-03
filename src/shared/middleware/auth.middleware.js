import { AppError } from '../errors/AppError.js';
import { env } from '../../config/env.config.js';

export function authMiddleware(req, _res, next) {
  const apiKey = req.headers['x-api-key'];
  const userId = req.headers['x-user-id'];

  if (env.nodeEnv !== 'development' && !apiKey) {
    throw new AppError('Missing x-api-key header', {
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
