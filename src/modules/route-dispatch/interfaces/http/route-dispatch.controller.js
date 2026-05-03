import { outboxRepository } from '../../../../infrastructure/persistence/repositories/outbox.repository.js';
import { routeDispatchRepository } from '../../../../infrastructure/persistence/repositories/route-dispatch.repository.js';
import { routeRepository } from '../../../../infrastructure/persistence/repositories/route.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import {
  buildCreateRouteDispatchInput,
  buildFinishRouteDispatchInput,
  buildStartRouteDispatchInput,
} from '../../application/dto/route-dispatch.input.js';
import { CreateRouteDispatchUseCase } from '../../application/use-cases/create-route-dispatch.usecase.js';
import { FinishRouteDispatchUseCase } from '../../application/use-cases/finish-route-dispatch.usecase.js';
import { GetRouteDispatchUseCase } from '../../application/use-cases/get-route-dispatch.usecase.js';
import { ListRouteDispatchesUseCase } from '../../application/use-cases/list-route-dispatches.usecase.js';
import { MarkRouteDispatchReadyUseCase } from '../../application/use-cases/mark-route-dispatch-ready.usecase.js';
import { StartRouteDispatchUseCase } from '../../application/use-cases/start-route-dispatch.usecase.js';
import {
  presentRouteDispatch,
  presentRouteDispatchList,
} from './route-dispatch.presenter.js';

const createRouteDispatchUseCase = new CreateRouteDispatchUseCase(
  routeDispatchRepository,
  routeRepository,
);
const getRouteDispatchUseCase = new GetRouteDispatchUseCase(routeDispatchRepository);
const listRouteDispatchesUseCase = new ListRouteDispatchesUseCase(routeDispatchRepository);
const markRouteDispatchReadyUseCase = new MarkRouteDispatchReadyUseCase(
  routeDispatchRepository,
  outboxRepository,
);
const startRouteDispatchUseCase = new StartRouteDispatchUseCase(
  routeDispatchRepository,
  outboxRepository,
);
const finishRouteDispatchUseCase = new FinishRouteDispatchUseCase(
  routeDispatchRepository,
  outboxRepository,
);

export const createRouteDispatch = asyncHandler(async (req, res) => {
  const input = buildCreateRouteDispatchInput(req.validated.body, req.user);
  const result = await createRouteDispatchUseCase.execute(input);

  return created(res, presentRouteDispatch(result));
});

export const getRouteDispatch = asyncHandler(async (req, res) => {
  const result = await getRouteDispatchUseCase.execute(req.validated.params.id);

  return success(res, presentRouteDispatch(result));
});

export const listRouteDispatches = asyncHandler(async (req, res) => {
  const result = await listRouteDispatchesUseCase.execute(req.validated.query);

  return success(res, presentRouteDispatchList(result));
});

export const markRouteDispatchReady = asyncHandler(async (req, res) => {
  const result = await markRouteDispatchReadyUseCase.execute(req.validated.params.id);

  return success(res, presentRouteDispatch(result));
});

export const startRouteDispatch = asyncHandler(async (req, res) => {
  const input = buildStartRouteDispatchInput(req.validated.body, req.user);
  const result = await startRouteDispatchUseCase.execute(req.validated.params.id, input);

  return success(res, presentRouteDispatch(result));
});

export const finishRouteDispatch = asyncHandler(async (req, res) => {
  const input = buildFinishRouteDispatchInput(req.validated.body);
  const result = await finishRouteDispatchUseCase.execute(req.validated.params.id, input);

  return success(res, presentRouteDispatch(result));
});

export const RouteDispatchController = {
  createRouteDispatch,
  getRouteDispatch,
  listRouteDispatches,
  markRouteDispatchReady,
  startRouteDispatch,
  finishRouteDispatch,
};
