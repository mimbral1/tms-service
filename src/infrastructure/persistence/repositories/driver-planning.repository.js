import { generateId } from '../../../shared/utils/id.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { driverPlanningToDomain } from '../mappers/driver-planning.persistence-mapper.js';

export class DriverPlanningRepository {
  async createDriverPlanning(driverPlanning) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, driverPlanning.id)
      .input('DriverId', sql.UniqueIdentifier, driverPlanning.driverId)
      .input('Availability', sql.NVarChar(30), driverPlanning.availability)
      .input('DateStart', sql.DateTime2, driverPlanning.dateStart)
      .input('DateEnd', sql.DateTime2, driverPlanning.dateEnd)
      .input('MotiveId', sql.UniqueIdentifier, driverPlanning.motiveId)
      .input('Comment', sql.NVarChar(1000), driverPlanning.comment)
      .input('RouteId', sql.UniqueIdentifier, driverPlanning.routeId)
      .input('UserCreated', sql.UniqueIdentifier, driverPlanning.userCreated)
      .query(`
        INSERT INTO tms.DriverPlanning (
          Id,
          DriverId,
          Availability,
          DateStart,
          DateEnd,
          MotiveId,
          Comment,
          RouteId,
          UserCreated
        )
        VALUES (
          @Id,
          @DriverId,
          @Availability,
          @DateStart,
          @DateEnd,
          @MotiveId,
          @Comment,
          @RouteId,
          @UserCreated
        )
      `);

    if (driverPlanning.warehouseIds?.length) {
      await this.replaceWarehouses(driverPlanning.id, driverPlanning.warehouseIds);
    }

    return this.findDriverPlanningById(driverPlanning.id);
  }

  async updateDriverPlanning(driverPlanning) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, driverPlanning.id)
      .input('DriverId', sql.UniqueIdentifier, driverPlanning.driverId)
      .input('Availability', sql.NVarChar(30), driverPlanning.availability)
      .input('DateStart', sql.DateTime2, driverPlanning.dateStart)
      .input('DateEnd', sql.DateTime2, driverPlanning.dateEnd)
      .input('MotiveId', sql.UniqueIdentifier, driverPlanning.motiveId)
      .input('Comment', sql.NVarChar(1000), driverPlanning.comment)
      .input('RouteId', sql.UniqueIdentifier, driverPlanning.routeId)
      .input('UserModified', sql.UniqueIdentifier, driverPlanning.userModified)
      .query(`
        UPDATE tms.DriverPlanning
        SET
          DriverId = @DriverId,
          Availability = @Availability,
          DateStart = @DateStart,
          DateEnd = @DateEnd,
          MotiveId = @MotiveId,
          Comment = @Comment,
          RouteId = @RouteId,
          UserModified = @UserModified,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    await this.replaceWarehouses(driverPlanning.id, driverPlanning.warehouseIds || []);

    return this.findDriverPlanningById(driverPlanning.id);
  }

  async findDriverPlanningById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.DriverPlanning
        WHERE Id = @Id
      `);

    const row = result.recordset[0];

    if (!row) return null;

    const warehouseIds = await this.findWarehouseIds(id);

    return driverPlanningToDomain(row, warehouseIds);
  }

  async deleteDriverPlanning(id) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('DriverPlanningId', sql.UniqueIdentifier, id)
      .query(`
        DELETE FROM tms.DriverPlanningWarehouse
        WHERE DriverPlanningId = @DriverPlanningId
      `);

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        DELETE FROM tms.DriverPlanning
        WHERE Id = @Id
      `);

    return { id };
  }

  async replaceWarehouses(driverPlanningId, warehouseIds = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('DriverPlanningId', sql.UniqueIdentifier, driverPlanningId)
      .query(`
        DELETE FROM tms.DriverPlanningWarehouse
        WHERE DriverPlanningId = @DriverPlanningId
      `);

    for (const warehouseId of warehouseIds) {
      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, generateId())
        .input('DriverPlanningId', sql.UniqueIdentifier, driverPlanningId)
        .input('WarehouseId', sql.UniqueIdentifier, warehouseId)
        .query(`
          INSERT INTO tms.DriverPlanningWarehouse (
            Id,
            DriverPlanningId,
            WarehouseId
          )
          VALUES (
            @Id,
            @DriverPlanningId,
            @WarehouseId
          )
        `);
    }
  }

  async findWarehouseIds(driverPlanningId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('DriverPlanningId', sql.UniqueIdentifier, driverPlanningId)
      .query(`
        SELECT WarehouseId
        FROM tms.DriverPlanningWarehouse
        WHERE DriverPlanningId = @DriverPlanningId
      `);

    return result.recordset.map((row) => row.WarehouseId);
  }

  async listDriverPlannings(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.driverId) {
      request.input('DriverId', sql.UniqueIdentifier, filters.driverId);
      where.push('DriverId = @DriverId');
    }

    if (filters.availability) {
      request.input('Availability', sql.NVarChar(30), filters.availability);
      where.push('Availability = @Availability');
    }

    if (filters.isFinished !== undefined) {
      request.input('IsFinished', sql.Bit, filters.isFinished);
      where.push('IsFinished = @IsFinished');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.DriverPlanning
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateStart DESC
    `);

    const items = [];

    for (const row of result.recordset) {
      const warehouseIds = await this.findWarehouseIds(row.Id);
      items.push(driverPlanningToDomain(row, warehouseIds));
    }

    return items;
  }

  async markRouteFinished(routeId) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .query(`
        UPDATE tms.DriverPlanning
        SET
          IsFinished = 1,
          DateModified = SYSUTCDATETIME()
        WHERE RouteId = @RouteId
      `);
  }
}

export const driverPlanningRepository = new DriverPlanningRepository();
