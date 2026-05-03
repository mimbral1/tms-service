import assert from 'node:assert/strict';
import test from 'node:test';
import { RoutePlanning } from '../../../src/modules/route-planning/domain/RoutePlanning.js';

function buildRoutePlanningFixture(overrides = {}) {
  return {
    id: '99999999-9999-4999-8999-999999999999',
    displayId: 'RPL-DEMO-001',
    scheduleFrom: '2026-05-03T08:00:00.000Z',
    scheduleTo: '2026-05-03T18:00:00.000Z',
    onlyShippingsReadyForPickup: true,
    status: 'processing',
    planningConditions: [
      {
        warehouseId: '44444444-4444-4444-8444-444444444444',
        shippingTypeIds: [],
        vehicleConfigurations: {
          types: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              quantity: 2,
            },
          ],
        },
      },
    ],
    ...overrides,
  };
}

test('RoutePlanning domain creates a valid route planning', () => {
  const planning = new RoutePlanning(buildRoutePlanningFixture());

  assert.equal(planning.displayId, 'RPL-DEMO-001');
  assert.equal(planning.status, 'processing');
  assert.equal(planning.planningConditions.length, 1);
});

test('RoutePlanning domain moves to pendingConfirmation when processed', () => {
  const planning = new RoutePlanning(buildRoutePlanningFixture());

  planning.markProcessed({
    warehouseCount: 1,
    vehicleTypeCount: 1,
    routeCount: 2,
    shippingCount: 0,
    assignedShippingCount: 0,
    unassignedShippingCount: 0,
  });

  assert.equal(planning.status, 'pendingConfirmation');
  assert.equal(planning.domainEvents[0].eventType, 'route_planning.processed');
});

test('RoutePlanning domain rejects invalid date range', () => {
  assert.throws(
    () => {
      new RoutePlanning(
        buildRoutePlanningFixture({
          scheduleFrom: '2026-05-03T18:00:00.000Z',
          scheduleTo: '2026-05-03T08:00:00.000Z',
        }),
      );
    },
    /scheduleFrom must be lower than scheduleTo/,
  );
});
