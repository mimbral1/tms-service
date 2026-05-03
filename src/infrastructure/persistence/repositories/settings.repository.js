import { Setting } from '../../../modules/settings/domain/Setting.js';
import { safeJsonParse } from '../../../shared/utils/json.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';

export class SettingsRepository {
  async findByEntity(entity) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Entity', sql.NVarChar(100), entity)
      .query(`
        SELECT *
        FROM tms.Setting
        WHERE Entity = @Entity
      `);

    const row = result.recordset[0];

    if (!row) return null;

    return new Setting({
      id: row.Id,
      entity: row.Entity,
      settings: safeJsonParse(row.SettingsJson, {}),
      dateCreated: row.DateCreated,
      dateModified: row.DateModified,
      userCreated: row.UserCreated,
      userModified: row.UserModified,
    });
  }

  async updateByEntity(entity, input) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Entity', sql.NVarChar(100), entity)
      .input('SettingsJson', sql.NVarChar(sql.MAX), JSON.stringify(input.settings))
      .input('UserModified', sql.UniqueIdentifier, input.userModified)
      .query(`
        UPDATE tms.Setting
        SET
          SettingsJson = @SettingsJson,
          UserModified = @UserModified,
          DateModified = SYSUTCDATETIME()
        WHERE Entity = @Entity
      `);

    return this.findByEntity(entity);
  }
}

export const settingsRepository = new SettingsRepository();
