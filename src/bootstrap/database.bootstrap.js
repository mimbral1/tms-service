import { logger } from '../config/logger.config.js';
import { connectSqlServer } from '../infrastructure/database/sqlserver.connection.js';

export async function bootstrapDatabase() {
  await connectSqlServer();
  logger.info('Database bootstrap completed');
}
