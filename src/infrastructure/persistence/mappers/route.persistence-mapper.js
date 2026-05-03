import { Route } from '../../../modules/route/domain/Route.js';
import { RouteStop } from '../../../modules/route/domain/RouteStop.js';
import { RouteStopAction } from '../../../modules/route/domain/RouteStopAction.js';

export function routeToDomain(row, stops = []) {
  if (!row) return null;

  return new Route({
    id: row.Id,
    displayId: row.DisplayId,
    companyId: row.CompanyId,
    driverId: row.DriverId,
    vehicleId: row.VehicleId,
    vehicleTypeId: row.VehicleTypeId,
    routePlanningId: row.RoutePlanningId,
    scheduleStart: row.ScheduleStart,
    scheduleEnd: row.ScheduleEnd,
    autoSchedule: row.AutoSchedule,
    status: row.Status,
    dateStarted: row.DateStarted,
    dateFinished: row.DateFinished,
    originLat: row.OriginLat,
    originLng: row.OriginLng,
    stops,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export function routeStopToDomain(row, actions = []) {
  if (!row) return null;

  return new RouteStop({
    id: row.Id,
    kind: row.Kind,
    warehouseId: row.WarehouseId,
    address: row.Address,
    latitude: row.Latitude,
    longitude: row.Longitude,
    position: row.Position,
    actions,
  });
}

export function routeStopActionToDomain(row) {
  if (!row) return null;

  return new RouteStopAction({
    id: row.Id,
    shippingId: row.ShippingId,
    relatedShippingId: row.RelatedShippingId,
    type: row.Type,
    status: row.Status,
  });
}

export const RoutePersistenceMapper = {
  toDomain: routeToDomain,
  routeToDomain,
  routeStopToDomain,
  routeStopActionToDomain,
};
