export function buildVehicleTypeFixture(overrides = {}) {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    referenceId: 'van',
    name: 'Camioneta',
    type: 'van',
    maxShippingQuantity: 20,
    maxProductQuantity: 500,
    maxVolume: 5000000,
    maxDistance: 120,
    maxWeight: 1200,
    fuelConsumption: 0.12,
    icon: 'van',
    companyId: null,
    status: 'active',
    ...overrides,
  };
}

export function buildVehicleFixture(overrides = {}) {
  return {
    id: '22222222-2222-4222-8222-222222222222',
    referenceId: null,
    name: 'Camioneta Demo 01',
    companyId: null,
    plate: 'DEMO01',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2024,
    capacity: 1200,
    vehicleTypeId: '11111111-1111-4111-8111-111111111111',
    status: 'active',
    ...overrides,
  };
}
