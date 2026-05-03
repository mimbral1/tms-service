import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  assignDriver,
  cancelRoute,
  createRoute,
  finishRoute,
  getRoute,
  listRoutes,
  startRoute,
  updateRouteTracking,
  updateVehicleTracking,
} from './route.controller.js';
import {
  assignDriverSchema,
  cancelRouteSchema,
  createRouteSchema,
  getRouteSchema,
  listRoutesSchema,
  startRouteSchema,
  trackingSchema,
  vehicleTrackingSchema,
} from './route.schema.js';

export function RouteRoutes() {
  const router = Router();

  router.get('/', validate(listRoutesSchema), listRoutes);
  router.post('/', validate(createRouteSchema), createRoute);
  router.get('/:id', validate(getRouteSchema), getRoute);
  router.post('/:id/assign-driver', validate(assignDriverSchema), assignDriver);
  router.post('/:id/start', validate(startRouteSchema), startRoute);
  router.post('/:id/finish', validate(getRouteSchema), finishRoute);
  router.post('/:id/cancel', validate(cancelRouteSchema), cancelRoute);
  router.post('/:id/tracking', validate(trackingSchema), updateRouteTracking);
  router.patch('/:id/vehicle-tracking', validate(vehicleTrackingSchema), updateVehicleTracking);

  return router;
}
