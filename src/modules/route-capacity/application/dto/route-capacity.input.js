export function buildCreateRouteCapacityInput(data, user) {
  return {
    name: data.name,
    warehouseId: data.warehouseId,
    shippingTypeId: data.shippingTypeId || null,
    vehicleTypeId: data.vehicleTypeId || null,
    dayOfWeek: data.dayOfWeek,
    isActive: data.isActive !== false,
    windows: data.windows,
    userCreated: user.id === 'system' ? null : user.id,
  };
}

export function buildUpdateRouteCapacityInput(data, user) {
  return {
    name: data.name,
    warehouseId: data.warehouseId,
    shippingTypeId: data.shippingTypeId || null,
    vehicleTypeId: data.vehicleTypeId || null,
    dayOfWeek: data.dayOfWeek,
    isActive: data.isActive !== false,
    windows: data.windows,
    userModified: user.id === 'system' ? null : user.id,
  };
}
