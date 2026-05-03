export function vehicleTypeOutput(vehicleType) {
  if (!vehicleType) return null;

  return {
    id: vehicleType.id,
    referenceId: vehicleType.referenceId,
    name: vehicleType.name,
    type: vehicleType.type,
    maxShippingQuantity: vehicleType.maxShippingQuantity,
    maxProductQuantity: vehicleType.maxProductQuantity,
    maxVolume: Number(vehicleType.maxVolume),
    maxDistance: Number(vehicleType.maxDistance),
    maxWeight: Number(vehicleType.maxWeight),
    fuelConsumption:
      vehicleType.fuelConsumption === null
        ? null
        : Number(vehicleType.fuelConsumption),
    icon: vehicleType.icon,
    companyId: vehicleType.companyId,
    status: vehicleType.status,
    dateCreated: vehicleType.dateCreated,
    dateModified: vehicleType.dateModified,
  };
}

export function vehicleTypeListOutput(vehicleTypes) {
  return vehicleTypes.map(vehicleTypeOutput);
}
