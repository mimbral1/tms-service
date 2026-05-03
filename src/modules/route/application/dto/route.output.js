export function routeOutput(route) {
  if (!route) return null;

  return {
    id: route.id,
    displayId: route.displayId,
    companyId: route.companyId,
    driverId: route.driverId,
    vehicleId: route.vehicleId,
    vehicleTypeId: route.vehicleTypeId,
    routePlanningId: route.routePlanningId,
    scheduleStart: route.scheduleStart,
    scheduleEnd: route.scheduleEnd,
    autoSchedule: route.autoSchedule,
    status: route.status,
    dateStarted: route.dateStarted,
    dateFinished: route.dateFinished,
    origin:
      route.originLat !== null && route.originLng !== null
        ? {
            lat: Number(route.originLat),
            lng: Number(route.originLng),
          }
        : null,
    stops: route.stops || [],
    dateCreated: route.dateCreated,
    dateModified: route.dateModified,
  };
}

export function routeListOutput(routes) {
  return routes.map(routeOutput);
}
