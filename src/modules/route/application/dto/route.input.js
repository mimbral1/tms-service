export function buildCreateRouteInput(data, user) {
  return {
    displayId: data.displayId || null,
    companyId: data.companyId || null,
    driverId: data.driverId || null,
    vehicleId: data.vehicleId || null,
    vehicleTypeId: data.vehicleTypeId || null,
    routePlanningId: data.routePlanningId || null,
    scheduleStart: data.scheduleStart || null,
    scheduleEnd: data.scheduleEnd || null,
    autoSchedule: data.autoSchedule !== false,
    originLat: data.originLat ?? null,
    originLng: data.originLng ?? null,
    stops: data.stops || [],
    userCreated: user.id === 'system' ? null : user.id,
  };
}
