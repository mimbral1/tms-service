export function buildCreateDriverPlanningInput(data, user) {
  return {
    driverIds: data.driverIds,
    warehouseIds: data.warehouseIds,
    timeSlots: data.timeSlots,
    userCreated: user.id === 'system' ? null : user.id,
  };
}

export function buildUpdateDriverPlanningInput(data, user) {
  return {
    driverId: data.driverId,
    warehouseIds: data.warehouseIds,
    availability: data.availability,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
    motiveId: data.motiveId || null,
    comment: data.comment || null,
    userModified: user.id === 'system' ? null : user.id,
  };
}
