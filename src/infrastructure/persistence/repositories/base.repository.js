import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';

export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM ${this.tableName}
        WHERE Id = @Id
      `);

    return result.recordset[0] || null;
  }

  async deleteById(id) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        DELETE FROM ${this.tableName}
        WHERE Id = @Id
      `);

    return { id };
  }
}
