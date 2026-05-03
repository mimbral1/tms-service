import assert from 'node:assert/strict';
import test from 'node:test';
import { UpdateVehicleUseCase } from '../../src/modules/vehicle/application/use-cases/update-vehicle.usecase.js';
import { Vehicle } from '../../src/modules/vehicle/domain/Vehicle.js';
import { VehicleType } from '../../src/modules/vehicle/domain/VehicleType.js';
import { NotFoundError } from '../../src/shared/errors/NotFoundError.js';

const vehicleId = '11111111-1111-4111-8111-111111111111';
const vehicleTypeId = '22222222-2222-4222-8222-222222222222';

function createVehicle(overrides = {}) {
  return new Vehicle({
    id: vehicleId,
    referenceId: 'VH-1',
    name: 'Van 1',
    companyId: null,
    plate: 'ABC123',
    brand: 'Ford',
    model: 'Transit',
    year: 2024,
    capacity: 1000,
    vehicleTypeId,
    status: 'active',
    userCreated: null,
    ...overrides,
  });
}

function createVehicleType(overrides = {}) {
  return new VehicleType({
    id: vehicleTypeId,
    referenceId: 'van',
    name: 'Van',
    type: 'van',
    maxShippingQuantity: 20,
    maxProductQuantity: 500,
    maxVolume: 5000000,
    maxDistance: 120,
    maxWeight: 1200,
    fuelConsumption: 0.12,
    icon: 'van',
    status: 'active',
    ...overrides,
  });
}

test('UpdateVehicleUseCase updates an existing vehicle', async () => {
  let savedVehicle = null;
  const repository = {
    findVehicleById: async () => createVehicle(),
    findVehicleTypeById: async () => createVehicleType(),
    updateVehicle: async (vehicle) => {
      savedVehicle = vehicle;
      return vehicle;
    },
  };

  const useCase = new UpdateVehicleUseCase(repository);

  const result = await useCase.execute(vehicleId, {
    referenceId: 'VH-2',
    name: 'Van 2',
    companyId: null,
    plate: 'DEF456',
    brand: 'Mercedes',
    model: 'Sprinter',
    year: 2025,
    capacity: 1500,
    vehicleTypeId,
    status: 'active',
    userModified: null,
  });

  assert.equal(savedVehicle.id, vehicleId);
  assert.equal(result.name, 'Van 2');
  assert.equal(result.plate, 'DEF456');
});

test('UpdateVehicleUseCase fails when vehicle does not exist', async () => {
  const repository = {
    findVehicleById: async () => null,
    findVehicleTypeById: async () => createVehicleType(),
    updateVehicle: async () => null,
  };

  const useCase = new UpdateVehicleUseCase(repository);

  await assert.rejects(
    () => useCase.execute(vehicleId, { vehicleTypeId }),
    NotFoundError,
  );
});

test('UpdateVehicleUseCase fails when vehicle type does not exist', async () => {
  const repository = {
    findVehicleById: async () => createVehicle(),
    findVehicleTypeById: async () => null,
    updateVehicle: async () => null,
  };

  const useCase = new UpdateVehicleUseCase(repository);

  await assert.rejects(
    () => useCase.execute(vehicleId, { vehicleTypeId }),
    NotFoundError,
  );
});
