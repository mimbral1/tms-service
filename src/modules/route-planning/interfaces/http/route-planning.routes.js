import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  confirmRoutePlanning,
  createRoutePlanning,
  getRoutePlanning,
  listRoutePlannings,
  processRoutePlanning,
} from './route-planning.controller.js';
import {
  confirmRoutePlanningSchema,
  createRoutePlanningSchema,
  getRoutePlanningSchema,
  listRoutePlanningsSchema,
} from './route-planning.schema.js';

export function RoutePlanningRoutes() {
  const router = Router();

  router.get('/', validate(listRoutePlanningsSchema), listRoutePlannings);
  router.post('/', validate(createRoutePlanningSchema), createRoutePlanning);
  router.get('/:id', validate(getRoutePlanningSchema), getRoutePlanning);
  router.post('/:id/process', validate(getRoutePlanningSchema), processRoutePlanning);
  router.post('/:id/confirm', validate(confirmRoutePlanningSchema), confirmRoutePlanning);

  return router;
}
