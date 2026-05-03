export function buildCreateRouteDispatchInput(data, user) {
  return {
    routeId: data.routeId,
    warehouseId: data.warehouseId,
    routeDisplayId: data.routeDisplayId,
    dispatchDate: data.dispatchDate || null,
    status: data.status || 'pending',
    userCreated: user.id === 'system' ? null : user.id,
  };
}

export function buildStartRouteDispatchInput(data, user) {
  return {
    dispatcherId: data.dispatcherId || (user.id === 'system' ? null : user.id),
  };
}

export function buildFinishRouteDispatchInput(data) {
  const packages = data.packages?.length
    ? data.packages
    : (data.packageIds || []).map((packageId, index) => ({
        packageId,
        shippingId: null,
        scanOrder: index + 1,
      }));

  return {
    packages,
    signature: data.signature || null,
  };
}
