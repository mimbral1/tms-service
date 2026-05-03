export function driverOutput(driver) {
  if (!driver) return null;

  return {
    id: driver.id,
    userId: driver.userId,
    firstname: driver.firstname,
    lastname: driver.lastname,
    fullname: driver.getFullName(),
    email: driver.email,
    documentNumber: driver.documentNumber,
    employeeId: driver.employeeId,
    activeWarehouseId: driver.activeWarehouseId,
    warehouseIds: driver.warehouseIds || [],
    status: driver.status,
    dateCreated: driver.dateCreated,
    dateModified: driver.dateModified,
  };
}

export function driverListOutput(drivers) {
  return drivers.map(driverOutput);
}
