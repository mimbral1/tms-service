import { generateId } from '../../../shared/utils/id.util.js';
import { safeJsonParse } from '../../../shared/utils/json.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { routePlanningToDomain } from '../mappers/route-planning.persistence-mapper.js';

export class RoutePlanningRepository {
  async createRoutePlanning(routePlanning) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, routePlanning.id)
      .input('DisplayId', sql.NVarChar(50), routePlanning.displayId)
      .input('ScheduleFrom', sql.DateTime2, routePlanning.scheduleFrom)
      .input('ScheduleTo', sql.DateTime2, routePlanning.scheduleTo)
      .input('OnlyShippingsReadyForPickup', sql.Bit, routePlanning.onlyShippingsReadyForPickup)
      .input('Status', sql.NVarChar(50), routePlanning.status)
      .input('UserCreated', sql.UniqueIdentifier, routePlanning.userCreated)
      .query(`
        INSERT INTO tms.RoutePlanning (
          Id,
          DisplayId,
          ScheduleFrom,
          ScheduleTo,
          OnlyShippingsReadyForPickup,
          Status,
          UserCreated
        )
        VALUES (
          @Id,
          @DisplayId,
          @ScheduleFrom,
          @ScheduleTo,
          @OnlyShippingsReadyForPickup,
          @Status,
          @UserCreated
        )
      `);

    await this.replacePlanningConditions(
      routePlanning.id,
      routePlanning.planningConditions || [],
    );

    return this.findRoutePlanningById(routePlanning.id);
  }

  async updateRoutePlanning(routePlanning) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, routePlanning.id)
      .input('Status', sql.NVarChar(50), routePlanning.status)
      .input('WarehouseCount', sql.Int, routePlanning.totals.warehouseCount)
      .input('VehicleTypeCount', sql.Int, routePlanning.totals.vehicleTypeCount)
      .input('RouteCount', sql.Int, routePlanning.totals.routeCount)
      .input('ShippingCount', sql.Int, routePlanning.totals.shippingCount)
      .input('AssignedShippingCount', sql.Int, routePlanning.totals.assignedShippingCount)
      .input('UnassignedShippingCount', sql.Int, routePlanning.totals.unassignedShippingCount)
      .input('ErrorMessage', sql.NVarChar(2000), routePlanning.errorMessage)
      .query(`
        UPDATE tms.RoutePlanning
        SET
          Status = @Status,
          WarehouseCount = @WarehouseCount,
          VehicleTypeCount = @VehicleTypeCount,
          RouteCount = @RouteCount,
          ShippingCount = @ShippingCount,
          AssignedShippingCount = @AssignedShippingCount,
          UnassignedShippingCount = @UnassignedShippingCount,
          ErrorMessage = @ErrorMessage,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    return this.findRoutePlanningById(routePlanning.id);
  }

  async findRoutePlanningById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.RoutePlanning
        WHERE Id = @Id
      `);

    const row = result.recordset[0];

    if (!row) return null;

    const planningConditions = await this.listPlanningConditions(id);

    return routePlanningToDomain(row, planningConditions);
  }

  async listRoutePlannings(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(50), filters.status);
      where.push('Status = @Status');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.RoutePlanning
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    const items = [];

    for (const row of result.recordset) {
      const planningConditions = await this.listPlanningConditions(row.Id);
      items.push(routePlanningToDomain(row, planningConditions));
    }

    return items;
  }

  async replacePlanningConditions(routePlanningId, conditions = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
      .query(`
        DELETE pvc
        FROM tms.RoutePlanningVehicleConfiguration pvc
        INNER JOIN tms.RoutePlanningCondition pc
          ON pc.Id = pvc.RoutePlanningConditionId
        WHERE pc.RoutePlanningId = @RoutePlanningId
      `);

    await pool
      .request()
      .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
      .query(`
        DELETE FROM tms.RoutePlanningCondition
        WHERE RoutePlanningId = @RoutePlanningId
      `);

    for (const condition of conditions) {
      const conditionId = generateId();

      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, conditionId)
        .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
        .input('WarehouseId', sql.UniqueIdentifier, condition.warehouseId)
        .input('ShippingTypeIdsJson', sql.NVarChar(sql.MAX), JSON.stringify(condition.shippingTypeIds || []))
        .query(`
          INSERT INTO tms.RoutePlanningCondition (
            Id,
            RoutePlanningId,
            WarehouseId,
            ShippingTypeIdsJson
          )
          VALUES (
            @Id,
            @RoutePlanningId,
            @WarehouseId,
            @ShippingTypeIdsJson
          )
        `);

      for (const vehicleType of condition.vehicleConfigurations.types || []) {
        await pool
          .request()
          .input('Id', sql.UniqueIdentifier, generateId())
          .input('RoutePlanningConditionId', sql.UniqueIdentifier, conditionId)
          .input('VehicleTypeId', sql.UniqueIdentifier, vehicleType.id)
          .input('Quantity', sql.Int, vehicleType.quantity || 1)
          .input('WindowStart', sql.DateTime2, null)
          .input('WindowEnd', sql.DateTime2, null)
          .query(`
            INSERT INTO tms.RoutePlanningVehicleConfiguration (
              Id,
              RoutePlanningConditionId,
              VehicleTypeId,
              Quantity,
              WindowStart,
              WindowEnd
            )
            VALUES (
              @Id,
              @RoutePlanningConditionId,
              @VehicleTypeId,
              @Quantity,
              @WindowStart,
              @WindowEnd
            )
          `);
      }
    }
  }

  async listPlanningConditions(routePlanningId) {
    const pool = getSqlServerPool();

    const conditionsResult = await pool
      .request()
      .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
      .query(`
        SELECT *
        FROM tms.RoutePlanningCondition
        WHERE RoutePlanningId = @RoutePlanningId
      `);

    const conditions = [];

    for (const row of conditionsResult.recordset) {
      const vehiclesResult = await pool
        .request()
        .input('RoutePlanningConditionId', sql.UniqueIdentifier, row.Id)
        .query(`
          SELECT *
          FROM tms.RoutePlanningVehicleConfiguration
          WHERE RoutePlanningConditionId = @RoutePlanningConditionId
        `);

      conditions.push({
        id: row.Id,
        warehouseId: row.WarehouseId,
        shippingTypeIds: safeJsonParse(row.ShippingTypeIdsJson, []),
        vehicleConfigurations: {
          types: vehiclesResult.recordset.map((vehicleRow) => ({
            id: vehicleRow.VehicleTypeId,
            quantity: vehicleRow.Quantity,
            windowStart: vehicleRow.WindowStart,
            windowEnd: vehicleRow.WindowEnd,
          })),
        },
      });
    }

    return conditions;
  }

  async savePlannedRoutes(routePlanningId, routes = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
      .query(`
        DELETE FROM tms.RoutePlanningRoute
        WHERE RoutePlanningId = @RoutePlanningId
          AND RouteId IS NULL
      `);

    for (const route of routes) {
      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, route.id || generateId())
        .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
        .input('VehicleTypeId', sql.UniqueIdentifier, route.vehicleTypeId || null)
        .input('DriverId', sql.UniqueIdentifier, route.driverId || null)
        .input('DurationExpected', sql.Int, route.duration?.expected || null)
        .input('StopsJson', sql.NVarChar(sql.MAX), JSON.stringify(route.stops || []))
        .input('Status', sql.NVarChar(30), 'planned')
        .query(`
          INSERT INTO tms.RoutePlanningRoute (
            Id,
            RoutePlanningId,
            VehicleTypeId,
            DriverId,
            DurationExpected,
            StopsJson,
            Status
          )
          VALUES (
            @Id,
            @RoutePlanningId,
            @VehicleTypeId,
            @DriverId,
            @DurationExpected,
            @StopsJson,
            @Status
          )
        `);
    }
  }

  async listPlannedRoutes(routePlanningId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('RoutePlanningId', sql.UniqueIdentifier, routePlanningId)
      .query(`
        SELECT *
        FROM tms.RoutePlanningRoute
        WHERE RoutePlanningId = @RoutePlanningId
        ORDER BY DateCreated ASC
      `);

    return result.recordset.map((row) => ({
      id: row.Id,
      routePlanningId: row.RoutePlanningId,
      routeId: row.RouteId,
      vehicleTypeId: row.VehicleTypeId,
      driverId: row.DriverId,
      duration: {
        expected: row.DurationExpected,
      },
      stops: safeJsonParse(row.StopsJson, []),
      status: row.Status,
    }));
  }

  async markPlannedRouteCreated(plannedRouteId, routeId) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, plannedRouteId)
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .query(`
        UPDATE tms.RoutePlanningRoute
        SET
          RouteId = @RouteId,
          Status = 'created'
        WHERE Id = @Id
      `);
  }
}

export const routePlanningRepository = new RoutePlanningRepository();
