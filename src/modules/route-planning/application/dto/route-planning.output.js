export function routePlanningOutput(routePlanning) {
  if (!routePlanning) return null;

  return {
    id: routePlanning.id,
    displayId: routePlanning.displayId,
    schedule: {
      from: routePlanning.scheduleFrom,
      to: routePlanning.scheduleTo,
    },
    onlyShippingsReadyForPickup: routePlanning.onlyShippingsReadyForPickup,
    status: routePlanning.status,
    totals: routePlanning.totals,
    errorMessage: routePlanning.errorMessage,
    planningConditions: routePlanning.planningConditions || [],
    dateCreated: routePlanning.dateCreated,
    dateModified: routePlanning.dateModified,
  };
}

export function routePlanningListOutput(items) {
  return items.map(routePlanningOutput);
}
