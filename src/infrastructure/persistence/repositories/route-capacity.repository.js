import { generateId } from '../../../shared/utils/id.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { routeCapacityToDomain } from '../mappers/route-capacity.persistence-mapper.js';

function normalizeSqlTime(value) {
  if (value instanceof Date) return value;

  const [hours, minutes, seconds = '00'] = String(value).split(':');
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), Number(seconds), 0);

  return date;
}

export class RouteCapacityRepository {
  async createRouteCapacity(routeCapacity) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, routeCapacity.id)
      .input('Name', sql.NVarChar(150), routeCapacity.name)
      .input('WarehouseId', sql.UniqueIdentifier, routeCapacity.warehouseId)
      .input('ShippingTypeId', sql.UniqueIdentifier, routeCapacity.shippingTypeId)
      .input('VehicleTypeId', sql.UniqueIdentifier, routeCapacity.vehicleTypeId)
      .input('DayOfWeek', sql.Int, routeCapacity.dayOfWeek)
      .input('IsActive', sql.Bit, routeCapacity.isActive)
      .input('UserCreated', sql.UniqueIdentifier, routeCapacity.userCreated)
      .query(`
        INSERT INTO tms.RouteCapacitySchema (
          Id, Name, WarehouseId, ShippingTypeId, VehicleTypeId, DayOfWeek, IsActive, UserCreated
        )
        VALUES (
          @Id, @Name, @WarehouseId, @ShippingTypeId, @VehicleTypeId, @DayOfWeek, @IsActive, @UserCreated
        )
      `);

    await this.replaceWindows(routeCapacity.id, routeCapacity.windows);

    return this.findRouteCapacityById(routeCapacity.id);
  }

  async updateRouteCapacity(routeCapacity) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, routeCapacity.id)
      .input('Name', sql.NVarChar(150), routeCapacity.name)
      .input('WarehouseId', sql.UniqueIdentifier, routeCapacity.warehouseId)
      .input('ShippingTypeId', sql.UniqueIdentifier, routeCapacity.shippingTypeId)
      .input('VehicleTypeId', sql.UniqueIdentifier, routeCapacity.vehicleTypeId)
      .input('DayOfWeek', sql.Int, routeCapacity.dayOfWeek)
      .input('IsActive', sql.Bit, routeCapacity.isActive)
      .input('UserModified', sql.UniqueIdentifier, routeCapacity.userModified)
      .query(`
        UPDATE tms.RouteCapacitySchema
        SET
          Name = @Name,
          WarehouseId = @WarehouseId,
          ShippingTypeId = @ShippingTypeId,
          VehicleTypeId = @VehicleTypeId,
          DayOfWeek = @DayOfWeek,
          IsActive = @IsActive,
          UserModified = @UserModified,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    await this.replaceWindows(routeCapacity.id, routeCapacity.windows);

    return this.findRouteCapacityById(routeCapacity.id);
  }

  async findRouteCapacityById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.RouteCapacitySchema
        WHERE Id = @Id
      `);

    const row = result.recordset[0];

    if (!row) return null;

    const windows = await this.listWindows(id);

    return routeCapacityToDomain(row, windows);
  }

  async listRouteCapacities(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.warehouseId) {
      request.input('WarehouseId', sql.UniqueIdentifier, filters.warehouseId);
      where.push('WarehouseId = @WarehouseId');
    }

    if (filters.dayOfWeek) {
      request.input('DayOfWeek', sql.Int, Number(filters.dayOfWeek));
      where.push('DayOfWeek = @DayOfWeek');
    }

    if (filters.isActive !== undefined) {
      request.input('IsActive', sql.Bit, filters.isActive);
      where.push('IsActive = @IsActive');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.RouteCapacitySchema
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DayOfWeek ASC, DateCreated DESC
    `);

    const items = [];

    for (const row of result.recordset) {
      const windows = await this.listWindows(row.Id);
      items.push(routeCapacityToDomain(row, windows));
    }

    return items;
  }

  async replaceWindows(routeCapacitySchemaId, windows = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RouteCapacitySchemaId', sql.UniqueIdentifier, routeCapacitySchemaId)
      .query(`
        DELETE FROM tms.RouteCapacityWindow
        WHERE RouteCapacitySchemaId = @RouteCapacitySchemaId
      `);

    for (const item of windows) {
      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, generateId())
        .input('RouteCapacitySchemaId', sql.UniqueIdentifier, routeCapacitySchemaId)
        .input('StartTime', sql.Time, normalizeSqlTime(item.startTime))
        .input('EndTime', sql.Time, normalizeSqlTime(item.endTime))
        .input('MaxRoutes', sql.Int, item.maxRoutes)
        .input('MaxShippings', sql.Int, item.maxShippings)
        .input('MaxPackages', sql.Int, item.maxPackages || null)
        .input('MaxWeight', sql.Decimal(18, 2), item.maxWeight || null)
        .input('MaxVolume', sql.Decimal(18, 2), item.maxVolume || null)
        .input('IsActive', sql.Bit, item.isActive !== false)
        .query(`
          INSERT INTO tms.RouteCapacityWindow (
            Id, RouteCapacitySchemaId, StartTime, EndTime, MaxRoutes, MaxShippings,
            MaxPackages, MaxWeight, MaxVolume, IsActive
          )
          VALUES (
            @Id, @RouteCapacitySchemaId, @StartTime, @EndTime, @MaxRoutes, @MaxShippings,
            @MaxPackages, @MaxWeight, @MaxVolume, @IsActive
          )
        `);
    }
  }

  async listWindows(routeCapacitySchemaId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('RouteCapacitySchemaId', sql.UniqueIdentifier, routeCapacitySchemaId)
      .query(`
        SELECT *
        FROM tms.RouteCapacityWindow
        WHERE RouteCapacitySchemaId = @RouteCapacitySchemaId
        ORDER BY StartTime ASC
      `);

    return result.recordset.map((row) => ({
      id: row.Id,
      routeCapacitySchemaId: row.RouteCapacitySchemaId,
      startTime: row.StartTime,
      endTime: row.EndTime,
      maxRoutes: row.MaxRoutes,
      maxShippings: row.MaxShippings,
      maxPackages: row.MaxPackages,
      maxWeight: row.MaxWeight === null ? null : Number(row.MaxWeight),
      maxVolume: row.MaxVolume === null ? null : Number(row.MaxVolume),
      isActive: Boolean(row.IsActive),
    }));
  }
}

export const routeCapacityRepository = new RouteCapacityRepository();
