import { getSqlServerPool, sql } from './sqlserver.connection.js';

export async function withTransaction(callback) {
  const pool = getSqlServerPool();
  const transaction = new sql.Transaction(pool);

  let transactionStarted = false;

  try {
    await transaction.begin();
    transactionStarted = true;

    const result = await callback({
      transaction,
      sql,
    });

    await transaction.commit();

    return result;
  } catch (error) {
    if (transactionStarted) {
      await transaction.rollback();
    }

    throw error;
  }
}

export function createTransactionRequest(transaction) {
  return new sql.Request(transaction);
}