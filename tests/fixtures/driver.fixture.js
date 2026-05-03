export function buildDriverFixture(overrides = {}) {
  return {
    id: '33333333-3333-4333-8333-333333333333',
    userId: null,
    firstname: 'Juan',
    lastname: 'Perez',
    email: 'juan.perez@mimbral.cl',
    documentNumber: '12345678-9',
    employeeId: 'DRV-001',
    activeWarehouseId: '44444444-4444-4444-8444-444444444444',
    warehouseIds: ['44444444-4444-4444-8444-444444444444'],
    status: 'active',
    ...overrides,
  };
}
