export function mapOrderResponse(response) {
  const data = response?.data || response;

  if (!data) return null;

  return {
    id: data.id,
    displayId: data.displayId,
    customerId: data.customerId,
    status: data.status,
    totalAmount: data.totalAmount,
    currency: data.currency,
    lines: data.lines || [],
  };
}
