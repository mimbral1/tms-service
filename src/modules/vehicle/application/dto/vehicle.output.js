export function vehicleOutput(vehicle) {
  if (!vehicle) return null;

  return {
    id: vehicle.id,
    referenceId: vehicle.referenceId,
    name: vehicle.name,
    companyId: vehicle.companyId,
    plate: vehicle.plate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    capacity: Number(vehicle.capacity),
    vehicleTypeId: vehicle.vehicleTypeId,
    location:
      vehicle.lastKnownLatitude !== null && vehicle.lastKnownLongitude !== null
        ? {
            latitude: Number(vehicle.lastKnownLatitude),
            longitude: Number(vehicle.lastKnownLongitude),
            date: vehicle.lastKnownLocationDate,
          }
        : null,
    status: vehicle.status,
    dateCreated: vehicle.dateCreated,
    dateModified: vehicle.dateModified,
  };
}

export function vehicleListOutput(vehicles) {
  return vehicles.map(vehicleOutput);
}
