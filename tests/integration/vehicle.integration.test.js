import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

test('Vehicle API GET /health returns healthy', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, 'healthy');
});

test('Vehicle API GET /api returns API running', async () => {
  const response = await request(app)
    .get('/api')
    .set('x-api-key', 'test-key')
    .set('x-user-id', 'system');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
});
