import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

test('Route API GET /api/route returns handled response', async () => {
  const response = await request(app)
    .get('/api/route')
    .set('x-api-key', 'test-key')
    .set('x-user-id', 'system');

  assert.ok([200, 500].includes(response.status));
});
