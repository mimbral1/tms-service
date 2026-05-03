export function buildCreateVehicleTypeInput(data, user) {
  return {
    referenceId: data.referenceId || null,
    name: data.name,
    type: data.type,
    maxShippingQuantity: data.maxShippingQuantity,
    maxProductQuantity: data.maxProductQuantity,
    maxVolume: data.maxVolume,
    maxDistance: data.maxDistance,
    maxWeight: data.maxWeight,
    fuelConsumption: data.fuelConsumption || null,
    icon: data.icon || null,
    companyId: data.companyId || null,
    status: data.status || 'active',
    userCreated: user.id === 'system' ? null : user.id,
  };
}
