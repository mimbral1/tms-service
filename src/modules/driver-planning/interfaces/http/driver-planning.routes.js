import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createDriverPlanning,
  deleteDriverPlanning,
  listDriverPlanning,
  updateDriverPlanning,
} from './driver-planning.controller.js';
import {
  createDriverPlanningSchema,
  deleteDriverPlanningSchema,
  listDriverPlanningSchema,
  updateDriverPlanningSchema,
} from './driver-planning.schema.js';

export function DriverPlanningRoutes() {
  const router = Router();

  router.get('/', validate(listDriverPlanningSchema), listDriverPlanning);
  router.post('/', validate(createDriverPlanningSchema), createDriverPlanning);
  router.put('/:id', validate(updateDriverPlanningSchema), updateDriverPlanning);
  router.delete('/:id', validate(deleteDriverPlanningSchema), deleteDriverPlanning);

  return router;
}
