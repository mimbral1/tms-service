export function buildCreateDriverInput(data, user) {
  return {
    userId: data.userId || null,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    documentNumber: data.documentNumber || null,
    employeeId: data.employeeId || null,
    activeWarehouseId: data.activeWarehouseId || null,
    warehouseIds: data.warehouseIds || [],
    status: data.status || 'active',
    userCreated: user.id === 'system' ? null : user.id,
  };
}
