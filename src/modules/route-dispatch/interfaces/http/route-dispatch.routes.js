import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import {
  createRouteDispatch,
  finishRouteDispatch,
  getRouteDispatch,
  listRouteDispatches,
  markRouteDispatchReady,
  startRouteDispatch,
} from './route-dispatch.controller.js';
import {
  createRouteDispatchSchema,
  finishRouteDispatchSchema,
  getRouteDispatchSchema,
  listRouteDispatchesSchema,
  startRouteDispatchSchema,
} from './route-dispatch.schema.js';

export function RouteDispatchRoutes() {
  const router = Router();

  router.get('/', validate(listRouteDispatchesSchema), listRouteDispatches);
  router.post('/', validate(createRouteDispatchSchema), createRouteDispatch);
  router.get('/:id', validate(getRouteDispatchSchema), getRouteDispatch);
  router.post('/:id/ready', validate(getRouteDispatchSchema), markRouteDispatchReady);
  router.post('/:id/start', validate(startRouteDispatchSchema), startRouteDispatch);
  router.post('/:id/finish', validate(finishRouteDispatchSchema), finishRouteDispatch);

  return router;
}
