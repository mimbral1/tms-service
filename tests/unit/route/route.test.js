import assert from 'node:assert/strict';
import test from 'node:test';
import { Route } from '../../../src/modules/route/domain/Route.js';
import { buildRouteFixture } from '../../fixtures/route.fixture.js';

test('Route domain creates a valid route', () => {
  const route = new Route(buildRouteFixture());

  assert.equal(route.displayId, 'RTE-DEMO-001');
  assert.equal(route.status, 'created');
  assert.equal(route.stops.length, 2);
});

test('Route domain starts route', () => {
  const route = new Route(buildRouteFixture());

  route.start({
    lat: -35.595,
    lng: -71.735,
  });

  assert.equal(route.status, 'started');
  assert.ok(route.dateStarted instanceof Date);
  assert.equal(route.originLat, -35.595);
  assert.equal(route.originLng, -71.735);
  assert.equal(route.domainEvents[0].eventType, 'route.started');
});

test('Route domain finishes route after started', () => {
  const route = new Route(buildRouteFixture());

  route.start();
  route.finish();

  assert.equal(route.status, 'finished');
  assert.ok(route.dateFinished instanceof Date);
});

test('Route domain rejects invalid transition from created to finished', () => {
  const route = new Route(buildRouteFixture());

  assert.throws(
    () => {
      route.finish();
    },
    /Transition from created to finished is not allowed/,
  );
});
