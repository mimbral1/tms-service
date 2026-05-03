import { driverRepository } from '../../../../infrastructure/persistence/repositories/driver.repository.js';
import { outboxRepository } from '../../../../infrastructure/persistence/repositories/outbox.repository.js';
import { routePlanningRepository } from '../../../../infrastructure/persistence/repositories/route-planning.repository.js';
import { routeRepository } from '../../../../infrastructure/persistence/repositories/route.repository.js';
import { vehicleRepository } from '../../../../infrastructure/persistence/repositories/vehicle.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import { CreateRouteUseCase } from '../../../route/application/use-cases/create-route.usecase.js';
import {
  buildConfirmRoutePlanningInput,
  buildCreateRoutePlanningInput,
} from '../../application/dto/route-planning.input.js';
import { ConfirmRoutePlanningUseCase } from '../../application/use-cases/confirm-route-planning.usecase.js';
import { CreateRoutePlanningUseCase } from '../../application/use-cases/create-route-planning.usecase.js';
import { GetRoutePlanningUseCase } from '../../application/use-cases/get-route-planning.usecase.js';
import { ListRoutePlanningsUseCase } from '../../application/use-cases/list-route-plannings.usecase.js';
import { ProcessRoutePlanningUseCase } from '../../application/use-cases/process-route-planning.usecase.js';
import {
  presentRoutePlanning,
  presentRoutePlanningList,
} from './route-planning.presenter.js';

const createRouteUseCase = new CreateRouteUseCase(
  routeRepository,
  driverRepository,
  vehicleRepository,
);

const createRoutePlanningUseCase = new CreateRoutePlanningUseCase(
  routePlanningRepository,
);
const getRoutePlanningUseCase = new GetRoutePlanningUseCase(routePlanningRepository);
const listRoutePlanningsUseCase = new ListRoutePlanningsUseCase(routePlanningRepository);
const processRoutePlanningUseCase = new ProcessRoutePlanningUseCase(
  routePlanningRepository,
  outboxRepository,
);
const confirmRoutePlanningUseCase = new ConfirmRoutePlanningUseCase({
  routePlanningRepository,
  outboxRepository,
  createRouteUseCase,
});

export const createRoutePlanning = asyncHandler(async (req, res) => {
  const input = buildCreateRoutePlanningInput(req.validated.body, req.user);
  const result = await createRoutePlanningUseCase.execute(input);

  return created(res, presentRoutePlanning(result));
});

export const getRoutePlanning = asyncHandler(async (req, res) => {
  const result = await getRoutePlanningUseCase.execute(req.validated.params.id);

  return success(res, presentRoutePlanning(result));
});

export const listRoutePlannings = asyncHandler(async (req, res) => {
  const result = await listRoutePlanningsUseCase.execute(req.validated.query);

  return success(res, presentRoutePlanningList(result));
});

export const processRoutePlanning = asyncHandler(async (req, res) => {
  const result = await processRoutePlanningUseCase.execute(req.validated.params.id);

  return success(res, presentRoutePlanning(result));
});

export const confirmRoutePlanning = asyncHandler(async (req, res) => {
  const input = buildConfirmRoutePlanningInput(req.validated.body);
  const result = await confirmRoutePlanningUseCase.execute(
    req.validated.params.id,
    input,
  );

  return success(res, result);
});

export const RoutePlanningController = {
  createRoutePlanning,
  getRoutePlanning,
  listRoutePlannings,
  processRoutePlanning,
  confirmRoutePlanning,
};
