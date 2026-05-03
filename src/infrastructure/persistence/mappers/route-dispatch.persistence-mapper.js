import { RouteDispatch } from '../../../modules/route-dispatch/domain/RouteDispatch.js';

export function routeDispatchToDomain(row, packages = []) {
  if (!row) return null;

  return new RouteDispatch({
    id: row.Id,
    routeId: row.RouteId,
    warehouseId: row.WarehouseId,
    routeDisplayId: row.RouteDisplayId,
    dispatchDate: row.DispatchDate,
    dispatcherId: row.DispatcherId,
    dispatchStartTime: row.DispatchStartTime,
    dispatchEndTime: row.DispatchEndTime,
    dispatchDuration: row.DispatchDuration,
    dispatchToken: row.DispatchToken,
    signature: row.Signature,
    status: row.Status,
    packages,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const RouteDispatchPersistenceMapper = {
  toDomain: routeDispatchToDomain,
  routeDispatchToDomain,
};
