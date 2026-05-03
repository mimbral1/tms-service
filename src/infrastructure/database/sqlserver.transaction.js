import { getSqlServerPool, sql } from './sqlserver.connection.js';

export async function withTransaction(callback) {
  const pool = getSqlServerPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const result = await callback({
      transaction,
      sql,
    });

    await transaction.commit();

    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
