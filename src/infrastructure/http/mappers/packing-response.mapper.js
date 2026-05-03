export function mapPackageResponse(response) {
  const data = response?.data || response;

  if (!data) return null;

  return {
    id: data.id,
    shippingId: data.shippingId,
    orderId: data.orderId,
    status: data.status,
    weight: data.weight,
    volume: data.volume,
    barcode: data.barcode,
    items: data.items || [],
  };
}

export function mapPackageListResponse(response) {
  const data = response?.data || response || [];
  return data.map(mapPackageResponse);
}
