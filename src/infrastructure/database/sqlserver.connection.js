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

export async function checkSqlServerConnection() {
  try {
    const currentPool = getSqlServerPool();

    await currentPool.request().query('SELECT 1 AS ok');

    return {
      success: true,
      status: 'connected',
    };
  } catch (error) {
    return {
      success: false,
      status: 'disconnected',
      error: error.message,
    };
  }
}

export { sql };