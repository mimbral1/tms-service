export function mapShippingResponse(response) {
  const data = response?.data || response;

  if (!data) return null;

  return {
    id: data.id,
    orderId: data.orderId,
    customerId: data.customerId,
    status: data.status,
    warehouseId: data.warehouseId,
    shippingTypeId: data.shippingTypeId,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    promisedDateFrom: data.promisedDateFrom,
    promisedDateTo: data.promisedDateTo,
  };
}
