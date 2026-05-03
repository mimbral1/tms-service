import { generateId } from '../../../shared/utils/id.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import {
  routeStopActionToDomain,
  routeStopToDomain,
  routeToDomain,
} from '../mappers/route.persistence-mapper.js';

export class RouteRepository {
  async createRoute(route) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, route.id)
      .input('DisplayId', sql.NVarChar(50), route.displayId)
      .input('CompanyId', sql.UniqueIdentifier, route.companyId)
      .input('DriverId', sql.UniqueIdentifier, route.driverId)
      .input('VehicleId', sql.UniqueIdentifier, route.vehicleId)
      .input('VehicleTypeId', sql.UniqueIdentifier, route.vehicleTypeId)
      .input('RoutePlanningId', sql.UniqueIdentifier, route.routePlanningId)
      .input('ScheduleStart', sql.DateTime2, route.scheduleStart)
      .input('ScheduleEnd', sql.DateTime2, route.scheduleEnd)
      .input('AutoSchedule', sql.Bit, route.autoSchedule)
      .input('Status', sql.NVarChar(30), route.status)
      .input('OriginLat', sql.Decimal(10, 7), route.originLat)
      .input('OriginLng', sql.Decimal(10, 7), route.originLng)
      .input('UserCreated', sql.UniqueIdentifier, route.userCreated)
      .query(`
        INSERT INTO tms.Route (
          Id, DisplayId, CompanyId, DriverId, VehicleId, VehicleTypeId,
          RoutePlanningId, ScheduleStart, ScheduleEnd, AutoSchedule, Status,
          OriginLat, OriginLng, UserCreated
        )
        VALUES (
          @Id, @DisplayId, @CompanyId, @DriverId, @VehicleId, @VehicleTypeId,
          @RoutePlanningId, @ScheduleStart, @ScheduleEnd, @AutoSchedule,
          @Status, @OriginLat, @OriginLng, @UserCreated
        )
      `);

    await this.replaceStops(route.id, route.stops || []);

    return this.findRouteById(route.id);
  }

  async updateRoute(route) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, route.id)
      .input('DriverId', sql.UniqueIdentifier, route.driverId)
      .input('Status', sql.NVarChar(30), route.status)
      .input('DateStarted', sql.DateTime2, route.dateStarted)
      .input('DateFinished', sql.DateTime2, route.dateFinished)
      .input('OriginLat', sql.Decimal(10, 7), route.originLat)
      .input('OriginLng', sql.Decimal(10, 7), route.originLng)
      .query(`
        UPDATE tms.Route
        SET
          DriverId = @DriverId,
          Status = @Status,
          DateStarted = @DateStarted,
          DateFinished = @DateFinished,
          OriginLat = @OriginLat,
          OriginLng = @OriginLng,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    return this.findRouteById(route.id);
  }

  async findRouteById(id) {
    const pool = getSqlServerPool();

    const routeResult = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.Route
        WHERE Id = @Id
      `);

    const routeRow = routeResult.recordset[0];

    if (!routeRow) return null;

    const stops = await this.findStopsByRouteId(id);

    return routeToDomain(routeRow, stops);
  }

  async findStopsByRouteId(routeId) {
    const pool = getSqlServerPool();

    const stopResult = await pool
      .request()
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .query(`
        SELECT *
        FROM tms.RouteStop
        WHERE RouteId = @RouteId
        ORDER BY Position ASC
      `);

    const stops = [];

    for (const stopRow of stopResult.recordset) {
      const actions = await this.findActionsByStopId(stopRow.Id);
      stops.push(routeStopToDomain(stopRow, actions));
    }

    return stops;
  }

  async findActionsByStopId(routeStopId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('RouteStopId', sql.UniqueIdentifier, routeStopId)
      .query(`
        SELECT *
        FROM tms.RouteStopAction
        WHERE RouteStopId = @RouteStopId
        ORDER BY DateCreated ASC
      `);

    return result.recordset.map(routeStopActionToDomain);
  }

  async replaceStops(routeId, stops = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .query(`
        DELETE rsa
        FROM tms.RouteStopAction rsa
        INNER JOIN tms.RouteStop rs ON rs.Id = rsa.RouteStopId
        WHERE rs.RouteId = @RouteId
      `);

    await pool
      .request()
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .query(`
        DELETE FROM tms.RouteStop
        WHERE RouteId = @RouteId
      `);

    for (let index = 0; index < stops.length; index += 1) {
      const stop = stops[index];
      const stopId = stop.id || generateId();

      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, stopId)
        .input('RouteId', sql.UniqueIdentifier, routeId)
        .input('Kind', sql.NVarChar(30), stop.kind)
        .input('WarehouseId', sql.UniqueIdentifier, stop.warehouseId || null)
        .input('Address', sql.NVarChar(500), stop.address)
        .input('Latitude', sql.Decimal(10, 7), stop.latitude ?? null)
        .input('Longitude', sql.Decimal(10, 7), stop.longitude ?? null)
        .input('Position', sql.Int, index + 1)
        .query(`
          INSERT INTO tms.RouteStop (
            Id, RouteId, Kind, WarehouseId, Address, Latitude, Longitude, Position
          )
          VALUES (
            @Id, @RouteId, @Kind, @WarehouseId, @Address, @Latitude, @Longitude, @Position
          )
        `);

      for (const action of stop.actions || []) {
        await pool
          .request()
          .input('Id', sql.UniqueIdentifier, action.id || generateId())
          .input('RouteStopId', sql.UniqueIdentifier, stopId)
          .input('ShippingId', sql.UniqueIdentifier, action.shippingId || null)
          .input('RelatedShippingId', sql.UniqueIdentifier, action.relatedShippingId || null)
          .input('Type', sql.NVarChar(30), action.type)
          .input('Status', sql.NVarChar(30), action.status || 'pending')
          .query(`
            INSERT INTO tms.RouteStopAction (
              Id, RouteStopId, ShippingId, RelatedShippingId, Type, Status
            )
            VALUES (
              @Id, @RouteStopId, @ShippingId, @RelatedShippingId, @Type, @Status
            )
          `);
      }
    }
  }

  async listRoutes(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(30), filters.status);
      where.push('Status = @Status');
    }

    if (filters.driverId) {
      request.input('DriverId', sql.UniqueIdentifier, filters.driverId);
      where.push('DriverId = @DriverId');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.Route
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    const routes = [];

    for (const row of result.recordset) {
      const stops = await this.findStopsByRouteId(row.Id);
      routes.push(routeToDomain(row, stops));
    }

    return routes;
  }

  async createRouteTracking(routeId, tracking, userId) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, generateId())
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .input('RouteStopId', sql.UniqueIdentifier, tracking.routeStopId || null)
      .input('ShippingId', sql.UniqueIdentifier, tracking.shippingId || null)
      .input('Status', sql.NVarChar(30), tracking.status)
      .input('CommentsJson', sql.NVarChar(sql.MAX), JSON.stringify(tracking.comments || []))
      .input('Latitude', sql.Decimal(10, 7), tracking.latitude ?? null)
      .input('Longitude', sql.Decimal(10, 7), tracking.longitude ?? null)
      .input('EventDate', sql.DateTime2, tracking.eventDate || new Date())
      .input('UserId', sql.UniqueIdentifier, userId === 'system' ? null : userId)
      .query(`
        INSERT INTO tms.RouteTracking (
          Id, RouteId, RouteStopId, ShippingId, Status, CommentsJson,
          Latitude, Longitude, EventDate, UserId
        )
        VALUES (
          @Id, @RouteId, @RouteStopId, @ShippingId, @Status, @CommentsJson,
          @Latitude, @Longitude, @EventDate, @UserId
        )
      `);
  }

  async createVehicleTracking(routeId, point) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, generateId())
      .input('RouteId', sql.UniqueIdentifier, routeId)
      .input('Latitude', sql.Decimal(10, 7), point.latitude)
      .input('Longitude', sql.Decimal(10, 7), point.longitude)
      .input('EventDate', sql.DateTime2, point.date || new Date())
      .query(`
        INSERT INTO tms.RouteVehicleTracking (
          Id, RouteId, Latitude, Longitude, EventDate
        )
        VALUES (
          @Id, @RouteId, @Latitude, @Longitude, @EventDate
        )
      `);
  }
}

export const routeRepository = new RouteRepository();
