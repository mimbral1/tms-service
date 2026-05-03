import { generateId } from '../../../shared/utils/id.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { routeDispatchToDomain } from '../mappers/route-dispatch.persistence-mapper.js';

export class RouteDispatchRepository {
  async createRouteDispatch(dispatch) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, dispatch.id)
      .input('RouteId', sql.UniqueIdentifier, dispatch.routeId)
      .input('WarehouseId', sql.UniqueIdentifier, dispatch.warehouseId)
      .input('RouteDisplayId', sql.NVarChar(50), dispatch.routeDisplayId)
      .input('DispatchDate', sql.DateTime2, dispatch.dispatchDate)
      .input('Status', sql.NVarChar(50), dispatch.status)
      .input('UserCreated', sql.UniqueIdentifier, dispatch.userCreated)
      .query(`
        INSERT INTO tms.RouteDispatch (
          Id,
          RouteId,
          WarehouseId,
          RouteDisplayId,
          DispatchDate,
          Status,
          UserCreated
        )
        VALUES (
          @Id,
          @RouteId,
          @WarehouseId,
          @RouteDisplayId,
          @DispatchDate,
          @Status,
          @UserCreated
        )
      `);

    return this.findRouteDispatchById(dispatch.id);
  }

  async updateRouteDispatch(dispatch) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, dispatch.id)
      .input('DispatcherId', sql.UniqueIdentifier, dispatch.dispatcherId)
      .input('DispatchStartTime', sql.DateTime2, dispatch.dispatchStartTime)
      .input('DispatchEndTime', sql.DateTime2, dispatch.dispatchEndTime)
      .input('DispatchDuration', sql.Int, dispatch.dispatchDuration)
      .input('DispatchToken', sql.NVarChar(10), dispatch.dispatchToken)
      .input('Signature', sql.NVarChar(1000), dispatch.signature)
      .input('Status', sql.NVarChar(50), dispatch.status)
      .query(`
        UPDATE tms.RouteDispatch
        SET
          DispatcherId = @DispatcherId,
          DispatchStartTime = @DispatchStartTime,
          DispatchEndTime = @DispatchEndTime,
          DispatchDuration = @DispatchDuration,
          DispatchToken = @DispatchToken,
          Signature = @Signature,
          Status = @Status,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    if (dispatch.packages?.length) {
      await this.replacePackages(dispatch.id, dispatch.packages);
    }

    return this.findRouteDispatchById(dispatch.id);
  }

  async findRouteDispatchById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.RouteDispatch
        WHERE Id = @Id
      `);

    const row = result.recordset[0];

    if (!row) return null;

    const packages = await this.listPackages(id);

    return routeDispatchToDomain(row, packages);
  }

  async listRouteDispatches(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(50), filters.status);
      where.push('Status = @Status');
    }

    if (filters.warehouseId) {
      request.input('WarehouseId', sql.UniqueIdentifier, filters.warehouseId);
      where.push('WarehouseId = @WarehouseId');
    }

    if (filters.routeId) {
      request.input('RouteId', sql.UniqueIdentifier, filters.routeId);
      where.push('RouteId = @RouteId');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.RouteDispatch
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    const items = [];

    for (const row of result.recordset) {
      const packages = await this.listPackages(row.Id);
      items.push(routeDispatchToDomain(row, packages));
    }

    return items;
  }

  async replacePackages(routeDispatchId, packages = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RouteDispatchId', sql.UniqueIdentifier, routeDispatchId)
      .query(`
        DELETE FROM tms.RouteDispatchPackage
        WHERE RouteDispatchId = @RouteDispatchId
      `);

    for (const item of packages) {
      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, generateId())
        .input('RouteDispatchId', sql.UniqueIdentifier, routeDispatchId)
        .input('PackageId', sql.UniqueIdentifier, item.packageId)
        .input('ShippingId', sql.UniqueIdentifier, item.shippingId || null)
        .input('ScanOrder', sql.Int, item.scanOrder || null)
        .input('DateScanned', sql.DateTime2, new Date())
        .query(`
          INSERT INTO tms.RouteDispatchPackage (
            Id,
            RouteDispatchId,
            PackageId,
            ShippingId,
            ScanOrder,
            DateScanned
          )
          VALUES (
            @Id,
            @RouteDispatchId,
            @PackageId,
            @ShippingId,
            @ScanOrder,
            @DateScanned
          )
        `);
    }
  }

  async listPackages(routeDispatchId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('RouteDispatchId', sql.UniqueIdentifier, routeDispatchId)
      .query(`
        SELECT *
        FROM tms.RouteDispatchPackage
        WHERE RouteDispatchId = @RouteDispatchId
        ORDER BY ScanOrder ASC
      `);

    return result.recordset.map((row) => ({
      id: row.Id,
      routeDispatchId: row.RouteDispatchId,
      packageId: row.PackageId,
      shippingId: row.ShippingId,
      scanOrder: row.ScanOrder,
      dateScanned: row.DateScanned,
    }));
  }
}

export const routeDispatchRepository = new RouteDispatchRepository();
