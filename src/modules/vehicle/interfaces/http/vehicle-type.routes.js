import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createVehicleType,
  getVehicleType,
  listVehicleTypes,
} from './vehicle-type.controller.js';
import {
  createVehicleTypeSchema,
  getVehicleTypeSchema,
  listVehicleTypesSchema,
} from './vehicle-type.schema.js';

export function VehicleTypeRoutes() {
  const router = Router();

  router.get('/', validate(listVehicleTypesSchema), listVehicleTypes);
  router.post('/', validate(createVehicleTypeSchema), createVehicleType);
  router.get('/:id', validate(getVehicleTypeSchema), getVehicleType);

  return router;
}
