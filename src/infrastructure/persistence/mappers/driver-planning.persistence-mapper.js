import { DriverPlanning } from '../../../modules/driver-planning/domain/DriverPlanning.js';

export function driverPlanningToDomain(row, warehouseIds = []) {
  if (!row) return null;

  return new DriverPlanning({
    id: row.Id,
    driverId: row.DriverId,
    warehouseIds,
    availability: row.Availability,
    dateStart: row.DateStart,
    dateEnd: row.DateEnd,
    motiveId: row.MotiveId,
    comment: row.Comment,
    routeId: row.RouteId,
    isFinished: row.IsFinished,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const DriverPlanningPersistenceMapper = {
  toDomain: driverPlanningToDomain,
  driverPlanningToDomain,
};
