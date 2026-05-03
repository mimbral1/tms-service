import { RouteCapacity } from '../../../modules/route-capacity/domain/RouteCapacity.js';

export function routeCapacityToDomain(row, windows = []) {
  if (!row) return null;

  return new RouteCapacity({
    id: row.Id,
    name: row.Name,
    warehouseId: row.WarehouseId,
    shippingTypeId: row.ShippingTypeId,
    vehicleTypeId: row.VehicleTypeId,
    dayOfWeek: row.DayOfWeek,
    isActive: row.IsActive,
    windows,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const RouteCapacityPersistenceMapper = {
  toDomain: routeCapacityToDomain,
  routeCapacityToDomain,
};
