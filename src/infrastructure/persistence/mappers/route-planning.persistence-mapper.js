import { RoutePlanning } from '../../../modules/route-planning/domain/RoutePlanning.js';

export function routePlanningToDomain(row, planningConditions = []) {
  if (!row) return null;

  return new RoutePlanning({
    id: row.Id,
    displayId: row.DisplayId,
    scheduleFrom: row.ScheduleFrom,
    scheduleTo: row.ScheduleTo,
    onlyShippingsReadyForPickup: row.OnlyShippingsReadyForPickup,
    status: row.Status,
    planningConditions,
    totals: {
      warehouseCount: row.WarehouseCount,
      vehicleTypeCount: row.VehicleTypeCount,
      routeCount: row.RouteCount,
      shippingCount: row.ShippingCount,
      assignedShippingCount: row.AssignedShippingCount,
      unassignedShippingCount: row.UnassignedShippingCount,
    },
    errorMessage: row.ErrorMessage,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const RoutePlanningPersistenceMapper = {
  toDomain: routePlanningToDomain,
  routePlanningToDomain,
};
