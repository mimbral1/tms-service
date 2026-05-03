import assert from 'node:assert/strict';
import test from 'node:test';
import { RouteDispatch } from '../../../src/modules/route-dispatch/domain/RouteDispatch.js';

function buildRouteDispatchFixture(overrides = {}) {
  return {
    id: '77777777-7777-4777-8777-777777777777',
    routeId: '55555555-5555-4555-8555-555555555555',
    warehouseId: '44444444-4444-4444-8444-444444444444',
    routeDisplayId: 'RTE-DEMO-001',
    status: 'pending',
    ...overrides,
  };
}

test('RouteDispatch domain creates a valid dispatch', () => {
  const dispatch = new RouteDispatch(buildRouteDispatchFixture());

  assert.equal(dispatch.routeId, '55555555-5555-4555-8555-555555555555');
  assert.equal(dispatch.status, 'pending');
});

test('RouteDispatch domain moves from pending to readyForDispatch', () => {
  const dispatch = new RouteDispatch(buildRouteDispatchFixture());

  dispatch.markReady();

  assert.equal(dispatch.status, 'readyForDispatch');
  assert.equal(dispatch.domainEvents[0].eventType, 'route_dispatch.ready');
});

test('RouteDispatch domain starts dispatch after ready', () => {
  const dispatch = new RouteDispatch(buildRouteDispatchFixture());

  dispatch.markReady();
  dispatch.start({
    dispatcherId: '99999999-9999-4999-8999-999999999999',
  });

  assert.equal(dispatch.status, 'preparingForDispatch');
  assert.ok(dispatch.dispatchStartTime instanceof Date);
});

test('RouteDispatch domain finishes dispatch after preparingForDispatch', () => {
  const dispatch = new RouteDispatch(buildRouteDispatchFixture());

  dispatch.markReady();
  dispatch.start({
    dispatcherId: '99999999-9999-4999-8999-999999999999',
  });
  dispatch.finish({
    packages: [
      {
        packageId: '88888888-8888-4888-8888-888888888888',
        shippingId: '66666666-6666-4666-8666-666666666666',
        scanOrder: 1,
      },
    ],
    signature: null,
    dispatchToken: '123456',
  });

  assert.equal(dispatch.status, 'dispatched');
  assert.equal(dispatch.dispatchToken, '123456');
  assert.equal(dispatch.packages.length, 1);
});
