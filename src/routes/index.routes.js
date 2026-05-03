import { Router } from 'express';
import { DriverPlanningRoutes } from '../modules/driver-planning/interfaces/http/driver-planning.routes.js';
import { DriverRoutes } from '../modules/driver/interfaces/http/driver.routes.js';
import { RouteDispatchRoutes } from '../modules/route-dispatch/interfaces/http/route-dispatch.routes.js';
import { RoutePlanningRoutes } from '../modules/route-planning/interfaces/http/route-planning.routes.js';
import { RouteCapacityRoutes } from '../modules/route-capacity/interfaces/http/route-capacity.routes.js';
import { RouteRoutes } from '../modules/route/interfaces/http/route.routes.js';
import { SettingsRoutes } from '../modules/settings/interfaces/http/settings.routes.js';
import { VehicleTypeRoutes } from '../modules/vehicle/interfaces/http/vehicle-type.routes.js';
import { VehicleRoutes } from '../modules/vehicle/interfaces/http/vehicle.routes.js';
import { authMiddleware } from '../shared/middleware/auth.middleware.js';

export function apiRoutes() {
  const router = Router();

  router.use(authMiddleware);

  router.get('/', (_req, res) => {
    res.json({
      success: true,
      service: 'tms-service',
      message: 'TMS API is running',
    });
  });

  router.get('/status', (_req, res) => {
    res.json({
      success: true,
      service: 'tms-service',
      status: 'running',
    });
  });

  router.use('/vehicle', VehicleRoutes());
  router.use('/vehicle-type', VehicleTypeRoutes());
  router.use('/driver', DriverRoutes());
  router.use('/driver-planning', DriverPlanningRoutes());
  router.use('/route', RouteRoutes());
  router.use('/route-dispatch', RouteDispatchRoutes());
  router.use('/route-planning', RoutePlanningRoutes());
  router.use('/route-capacity-schema', RouteCapacityRoutes());
  router.use('/setting', SettingsRoutes());

  return router;
}
