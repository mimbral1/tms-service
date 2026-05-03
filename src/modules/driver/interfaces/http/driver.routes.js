import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createDriver,
  getDriver,
  listAvailableDrivers,
  listDrivers,
} from './driver.controller.js';
import {
  createDriverSchema,
  getDriverSchema,
  listAvailableDriversSchema,
  listDriversSchema,
} from './driver.schema.js';

export function DriverRoutes() {
  const router = Router();

  router.get('/', validate(listDriversSchema), listDrivers);
  router.post('/', validate(createDriverSchema), createDriver);
  router.get('/available', validate(listAvailableDriversSchema), listAvailableDrivers);
  router.get('/:id', validate(getDriverSchema), getDriver);

  return router;
}
