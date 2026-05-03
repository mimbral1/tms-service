import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
  updateVehicleLocation,
} from './vehicle.controller.js';
import {
  createVehicleSchema,
  getVehicleSchema,
  listVehiclesSchema,
  updateVehicleSchema,
  updateVehicleLocationSchema,
} from './vehicle.schema.js';

export function VehicleRoutes() {
  const router = Router();

  router.get('/', validate(listVehiclesSchema), listVehicles);
  router.post('/', validate(createVehicleSchema), createVehicle);
  router.get('/:id', validate(getVehicleSchema), getVehicle);
  router.put('/:id', validate(updateVehicleSchema), updateVehicle);
  router.patch(
    '/:id/location',
    validate(updateVehicleLocationSchema),
    updateVehicleLocation,
  );

  return router;
}
