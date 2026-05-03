import { driverPlanningRepository } from '../../../../infrastructure/persistence/repositories/driver-planning.repository.js';
import { driverRepository } from '../../../../infrastructure/persistence/repositories/driver.repository.js';
import { outboxRepository } from '../../../../infrastructure/persistence/repositories/outbox.repository.js';
import { routeRepository } from '../../../../infrastructure/persistence/repositories/route.repository.js';
import { vehicleRepository } from '../../../../infrastructure/persistence/repositories/vehicle.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import { buildCreateRouteInput } from '../../application/dto/route.input.js';
import { AssignDriverUseCase } from '../../application/use-cases/assign-driver.usecase.js';
import { CancelRouteUseCase } from '../../application/use-cases/cancel-route.usecase.js';
import { CreateRouteUseCase } from '../../application/use-cases/create-route.usecase.js';
import { FinishRouteUseCase } from '../../application/use-cases/finish-route.usecase.js';
import { GetRouteUseCase } from '../../application/use-cases/get-route.usecase.js';
import { ListRoutesUseCase } from '../../application/use-cases/list-routes.usecase.js';
import { StartRouteUseCase } from '../../application/use-cases/start-route.usecase.js';
import { UpdateRouteTrackingUseCase } from '../../application/use-cases/update-route-tracking.usecase.js';
import { UpdateVehicleTrackingUseCase } from '../../application/use-cases/update-vehicle-tracking.usecase.js';
import { presentRoute, presentRouteList } from './route.presenter.js';

const createRouteUseCase = new CreateRouteUseCase(
  routeRepository,
  driverRepository,
  vehicleRepository,
);

const getRouteUseCase = new GetRouteUseCase(routeRepository);
const listRoutesUseCase = new ListRoutesUseCase(routeRepository);

const assignDriverUseCase = new AssignDriverUseCase(
  routeRepository,
  driverRepository,
  outboxRepository,
);

const startRouteUseCase = new StartRouteUseCase(routeRepository, outboxRepository);

const finishRouteUseCase = new FinishRouteUseCase(
  routeRepository,
  outboxRepository,
  driverPlanningRepository,
);

const cancelRouteUseCase = new CancelRouteUseCase(routeRepository, outboxRepository);
const updateRouteTrackingUseCase = new UpdateRouteTrackingUseCase(routeRepository);
const updateVehicleTrackingUseCase = new UpdateVehicleTrackingUseCase(routeRepository);

export const createRoute = asyncHandler(async (req, res) => {
  const input = buildCreateRouteInput(req.validated.body, req.user);
  const result = await createRouteUseCase.execute(input);

  return created(res, presentRoute(result));
});

export const getRoute = asyncHandler(async (req, res) => {
  const result = await getRouteUseCase.execute(req.validated.params.id);

  return success(res, presentRoute(result));
});

export const listRoutes = asyncHandler(async (req, res) => {
  const result = await listRoutesUseCase.execute(req.validated.query);

  return success(res, presentRouteList(result));
});

export const assignDriver = asyncHandler(async (req, res) => {
  const result = await assignDriverUseCase.execute(
    req.validated.params.id,
    req.validated.body,
  );

  return success(res, presentRoute(result));
});

export const startRoute = asyncHandler(async (req, res) => {
  const result = await startRouteUseCase.execute(
    req.validated.params.id,
    req.validated.body || {},
  );

  return success(res, presentRoute(result));
});

export const finishRoute = asyncHandler(async (req, res) => {
  const result = await finishRouteUseCase.execute(req.validated.params.id);

  return success(res, presentRoute(result));
});

export const cancelRoute = asyncHandler(async (req, res) => {
  const result = await cancelRouteUseCase.execute(
    req.validated.params.id,
    req.validated.body || {},
  );

  return success(res, presentRoute(result));
});

export const updateRouteTracking = asyncHandler(async (req, res) => {
  const result = await updateRouteTrackingUseCase.execute(
    req.validated.params.id,
    req.validated.body,
    req.user,
  );

  return success(res, result);
});

export const updateVehicleTracking = asyncHandler(async (req, res) => {
  const result = await updateVehicleTrackingUseCase.execute(
    req.validated.params.id,
    req.validated.body,
  );

  return success(res, result);
});

export const RouteController = {
  createRoute,
  getRoute,
  listRoutes,
  assignDriver,
  startRoute,
  finishRoute,
  cancelRoute,
  updateRouteTracking,
  updateVehicleTracking,
};
