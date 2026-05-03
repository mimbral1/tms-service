export function driverPlanningOutput(driverPlanning) {
  if (!driverPlanning) return null;

  return {
    id: driverPlanning.id,
    driverId: driverPlanning.driverId,
    warehouseIds: driverPlanning.warehouseIds || [],
    availability: driverPlanning.availability,
    dateStart: driverPlanning.dateStart,
    dateEnd: driverPlanning.dateEnd,
    motiveId: driverPlanning.motiveId,
    comment: driverPlanning.comment,
    routeId: driverPlanning.routeId,
    isFinished: driverPlanning.isFinished,
    dateCreated: driverPlanning.dateCreated,
    dateModified: driverPlanning.dateModified,
  };
}

export function driverPlanningListOutput(items) {
  return items.map(driverPlanningOutput);
}
