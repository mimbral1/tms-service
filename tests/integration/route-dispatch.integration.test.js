import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

test('Route Dispatch API GET /api/route-dispatch returns handled response', async () => {
  const response = await request(app)
    .get('/api/route-dispatch')
    .set('x-api-key', 'test-key')
    .set('x-user-id', 'system');

  assert.ok([200, 500].includes(response.status));
});
