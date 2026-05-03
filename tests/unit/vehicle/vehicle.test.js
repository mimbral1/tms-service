import assert from 'node:assert/strict';
import test from 'node:test';
import { Vehicle } from '../../../src/modules/vehicle/domain/Vehicle.js';
import { buildVehicleFixture } from '../../fixtures/vehicle.fixture.js';

test('Vehicle domain creates a valid vehicle', () => {
  const vehicle = new Vehicle(buildVehicleFixture());

  assert.equal(vehicle.name, 'Camioneta Demo 01');
  assert.equal(vehicle.plate, 'DEMO01');
  assert.equal(vehicle.status, 'active');
});

test('Vehicle domain updates location and creates domain event', () => {
  const vehicle = new Vehicle(buildVehicleFixture());

  vehicle.updateLocation({
    latitude: -35.4264,
    longitude: -71.6554,
    date: new Date('2026-05-03T12:00:00.000Z'),
  });

  assert.equal(vehicle.lastKnownLatitude, -35.4264);
  assert.equal(vehicle.lastKnownLongitude, -71.6554);
  assert.equal(vehicle.domainEvents.length, 1);
  assert.equal(vehicle.domainEvents[0].eventType, 'vehicle.location_updated');
});

test('Vehicle domain rejects invalid latitude', () => {
  const vehicle = new Vehicle(buildVehicleFixture());

  assert.throws(
    () => {
      vehicle.updateLocation({
        latitude: -100,
        longitude: -71.6554,
      });
    },
    /Invalid latitude/,
  );
});
