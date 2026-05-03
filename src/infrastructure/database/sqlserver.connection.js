import sql from 'mssql';
import { databaseConfig } from '../../config/database.config.js';
import { logger } from '../../config/logger.config.js';

let pool = null;

export async function connectSqlServer() {
  if (pool) return pool;

  try {
    pool = await sql.connect(databaseConfig);
    logger.info('SQL Server connected');
    return pool;
  } catch (error) {
    logger.error('SQL Server connection failed', { error });
    throw error;
  }
}

export function getSqlServerPool() {
  if (!pool) {
    throw new Error('SQL Server pool has not been initialized');
  }

  return pool;
}

export { sql };
