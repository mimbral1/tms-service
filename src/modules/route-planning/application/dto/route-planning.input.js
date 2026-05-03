export function buildCreateRoutePlanningInput(data, user) {
  return {
    scheduleFrom: data.schedule.from,
    scheduleTo: data.schedule.to,
    onlyShippingsReadyForPickup: data.onlyShippingsReadyForPickup ?? null,
    planningConditions: data.planningConditions,
    userCreated: user.id === 'system' ? null : user.id,
  };
}

export function buildProcessRoutePlanningInput(data) {
  return {
    planningConditions: data.planningConditions,
  };
}

export function buildConfirmRoutePlanningInput(data) {
  return {
    routingConfirmed: data.routingConfirmed === true,
    routes: data.routes || null,
  };
}
