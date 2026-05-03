export function buildRouteFixture(overrides = {}) {
  return {
    id: '55555555-5555-4555-8555-555555555555',
    displayId: 'RTE-DEMO-001',
    companyId: null,
    driverId: '33333333-3333-4333-8333-333333333333',
    vehicleId: '22222222-2222-4222-8222-222222222222',
    vehicleTypeId: '11111111-1111-4111-8111-111111111111',
    routePlanningId: null,
    scheduleStart: '2026-05-03T08:00:00.000Z',
    scheduleEnd: '2026-05-03T18:00:00.000Z',
    autoSchedule: true,
    status: 'created',
    stops: [
      {
        kind: 'warehouse',
        warehouseId: '44444444-4444-4444-8444-444444444444',
        address: 'Mimbral San Javier',
        latitude: -35.595,
        longitude: -71.735,
        actions: [
          {
            type: 'pickup',
            shippingId: null,
          },
        ],
      },
      {
        kind: 'customer',
        warehouseId: null,
        address: 'Cliente demo',
        latitude: -35.4264,
        longitude: -71.6554,
        actions: [
          {
            type: 'dropoff',
            shippingId: '66666666-6666-4666-8666-666666666666',
          },
        ],
      },
    ],
    ...overrides,
  };
}
