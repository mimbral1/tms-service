export function buildCreateVehicleInput(data, user) {
  return {
    referenceId: data.referenceId || null,
    name: data.name,
    companyId: data.companyId || null,
    plate: data.plate,
    brand: data.brand,
    model: data.model,
    year: data.year,
    capacity: data.capacity,
    vehicleTypeId: data.vehicleTypeId,
    status: data.status || 'active',
    userCreated: user.id === 'system' ? null : user.id,
  };
}

export function buildUpdateVehicleInput(data, user) {
  return {
    referenceId: data.referenceId || null,
    name: data.name,
    companyId: data.companyId || null,
    plate: data.plate,
    brand: data.brand,
    model: data.model,
    year: data.year,
    capacity: data.capacity,
    vehicleTypeId: data.vehicleTypeId,
    status: data.status || 'active',
    userModified: user.id === 'system' ? null : user.id,
  };
}

export function buildUpdateVehicleLocationInput(data) {
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    date: data.date || new Date(),
  };
}
