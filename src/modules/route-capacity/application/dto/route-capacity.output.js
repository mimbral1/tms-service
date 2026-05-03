export function routeCapacityOutput(item) {
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    warehouseId: item.warehouseId,
    shippingTypeId: item.shippingTypeId,
    vehicleTypeId: item.vehicleTypeId,
    dayOfWeek: item.dayOfWeek,
    isActive: item.isActive,
    windows: item.windows || [],
    dateCreated: item.dateCreated,
    dateModified: item.dateModified,
  };
}

export function routeCapacityListOutput(items) {
  return items.map(routeCapacityOutput);
}
