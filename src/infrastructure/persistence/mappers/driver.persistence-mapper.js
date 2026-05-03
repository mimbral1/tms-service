import { Driver } from '../../../modules/driver/domain/Driver.js';

export function driverToDomain(row, warehouseIds = []) {
  if (!row) return null;

  return new Driver({
    id: row.Id,
    userId: row.UserId,
    firstname: row.Firstname,
    lastname: row.Lastname,
    email: row.Email,
    documentNumber: row.DocumentNumber,
    employeeId: row.EmployeeId,
    activeWarehouseId: row.ActiveWarehouseId,
    warehouseIds,
    status: row.Status,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const DriverPersistenceMapper = {
  toDomain: driverToDomain,
  driverToDomain,
};
