import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createRouteCapacity,
  getRouteCapacity,
  listRouteCapacities,
  updateRouteCapacity,
} from './route-capacity.controller.js';
import {
  createRouteCapacitySchema,
  getRouteCapacitySchema,
  listRouteCapacitySchema,
  updateRouteCapacitySchema,
} from './route-capacity.schema.js';

export function RouteCapacityRoutes() {
  const router = Router();

  router.get('/', validate(listRouteCapacitySchema), listRouteCapacities);
  router.post('/', validate(createRouteCapacitySchema), createRouteCapacity);
  router.get('/:id', validate(getRouteCapacitySchema), getRouteCapacity);
  router.put('/:id', validate(updateRouteCapacitySchema), updateRouteCapacity);

  return router;
}
