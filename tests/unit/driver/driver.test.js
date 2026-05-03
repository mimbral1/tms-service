import assert from 'node:assert/strict';
import test from 'node:test';
import { Driver } from '../../../src/modules/driver/domain/Driver.js';
import { buildDriverFixture } from '../../fixtures/driver.fixture.js';

test('Driver domain creates a valid driver', () => {
  const driver = new Driver(buildDriverFixture());

  assert.equal(driver.firstname, 'Juan');
  assert.equal(driver.lastname, 'Perez');
  assert.equal(driver.email, 'juan.perez@mimbral.cl');
  assert.equal(driver.getFullName(), 'Juan Perez');
});

test('Driver domain assigns warehouses', () => {
  const driver = new Driver(buildDriverFixture({ warehouseIds: [] }));

  driver.assignWarehouses(['44444444-4444-4444-8444-444444444444']);

  assert.equal(driver.warehouseIds.length, 1);
  assert.equal(driver.activeWarehouseId, '44444444-4444-4444-8444-444444444444');
});

test('Driver domain deactivates driver', () => {
  const driver = new Driver(buildDriverFixture());

  driver.deactivate();

  assert.equal(driver.status, 'inactive');
});
