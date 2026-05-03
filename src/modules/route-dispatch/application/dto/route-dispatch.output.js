export function routeDispatchOutput(dispatch) {
  if (!dispatch) return null;

  return {
    id: dispatch.id,
    routeId: dispatch.routeId,
    warehouseId: dispatch.warehouseId,
    routeDisplayId: dispatch.routeDisplayId,
    dispatchDate: dispatch.dispatchDate,
    dispatcherId: dispatch.dispatcherId,
    dispatchStartTime: dispatch.dispatchStartTime,
    dispatchEndTime: dispatch.dispatchEndTime,
    dispatchDuration: dispatch.dispatchDuration,
    dispatchToken: dispatch.dispatchToken,
    signature: dispatch.signature,
    status: dispatch.status,
    packages: dispatch.packages || [],
    dateCreated: dispatch.dateCreated,
    dateModified: dispatch.dateModified,
  };
}

export function routeDispatchListOutput(items) {
  return items.map(routeDispatchOutput);
}
