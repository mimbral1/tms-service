import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { createTransactionRequest } from '../../database/sqlserver.transaction.js';
import { OutboxStatus } from '../../../outbox/domain/OutboxStatus.js';
import { BaseRepository } from './base.repository.js';

export class OutboxRepository extends BaseRepository {
  constructor() {
    super('tms.OutboxEvent');
  }

  async create(event, transaction = null) {
    const pool = getSqlServerPool();

    const request = transaction
      ? createTransactionRequest(transaction)
      : pool.request();

    await request
      .input('Id', sql.UniqueIdentifier, event.id)
      .input('Topic', sql.NVarChar(200), event.topic)
      .input('EventType', sql.NVarChar(200), event.eventType)
      .input('AggregateId', sql.UniqueIdentifier, event.aggregateId)
      .input('PayloadJson', sql.NVarChar(sql.MAX), JSON.stringify(event.payload))
      .query(`
        INSERT INTO tms.OutboxEvent (
          Id,
          Topic,
          EventType,
          AggregateId,
          PayloadJson,
          Status,
          RetryCount,
          DateCreated
        )
        VALUES (
          @Id,
          @Topic,
          @EventType,
          @AggregateId,
          @PayloadJson,
          'pending',
          0,
          SYSUTCDATETIME()
        )
      `);

    return event;
  }

  async getPending(limit = 50) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Limit', sql.Int, limit)
      .query(`
        SELECT TOP (@Limit) *
        FROM tms.OutboxEvent
        WHERE Status = 'pending'
        ORDER BY DateCreated ASC
      `);

    return result.recordset;
  }

  async markProcessing(id) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        UPDATE tms.OutboxEvent
        SET
          Status = '${OutboxStatus.PROCESSING}',
          ProcessingStartedAt = SYSUTCDATETIME()
        WHERE Id = @Id
      `);
  }

  async markPublished(id) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        UPDATE tms.OutboxEvent
        SET
          Status = '${OutboxStatus.PUBLISHED}',
          PublishedAt = SYSUTCDATETIME()
        WHERE Id = @Id
      `);
  }

  async markFailed(id, error) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('LastError', sql.NVarChar(sql.MAX), error.message)
      .query(`
        UPDATE tms.OutboxEvent
        SET
          RetryCount = RetryCount + 1,
          LastError = @LastError,
          Status =
            CASE
              WHEN RetryCount + 1 >= 5 THEN '${OutboxStatus.FAILED}'
              ELSE '${OutboxStatus.PENDING}'
            END
        WHERE Id = @Id
      `);
  }
}

export const outboxRepository = new OutboxRepository();