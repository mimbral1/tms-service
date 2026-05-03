import { routeCapacityRepository } from '../../../../infrastructure/persistence/repositories/route-capacity.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import {
  buildCreateRouteCapacityInput,
  buildUpdateRouteCapacityInput,
} from '../../application/dto/route-capacity.input.js';
import { CreateRouteCapacityUseCase } from '../../application/use-cases/create-route-capacity.usecase.js';
import { GetRouteCapacityUseCase } from '../../application/use-cases/get-route-capacity.usecase.js';
import { ListRouteCapacitiesUseCase } from '../../application/use-cases/list-route-capacities.usecase.js';
import { UpdateRouteCapacityUseCase } from '../../application/use-cases/update-route-capacity.usecase.js';
import {
  presentRouteCapacity,
  presentRouteCapacityList,
} from './route-capacity.presenter.js';

const createRouteCapacityUseCase = new CreateRouteCapacityUseCase(routeCapacityRepository);
const updateRouteCapacityUseCase = new UpdateRouteCapacityUseCase(routeCapacityRepository);
const getRouteCapacityUseCase = new GetRouteCapacityUseCase(routeCapacityRepository);
const listRouteCapacitiesUseCase = new ListRouteCapacitiesUseCase(routeCapacityRepository);

export const createRouteCapacity = asyncHandler(async (req, res) => {
  const input = buildCreateRouteCapacityInput(req.validated.body, req.user);
  const result = await createRouteCapacityUseCase.execute(input);

  return created(res, presentRouteCapacity(result));
});

export const updateRouteCapacity = asyncHandler(async (req, res) => {
  const input = buildUpdateRouteCapacityInput(req.validated.body, req.user);
  const result = await updateRouteCapacityUseCase.execute(
    req.validated.params.id,
    input,
  );

  return success(res, presentRouteCapacity(result));
});

export const getRouteCapacity = asyncHandler(async (req, res) => {
  const result = await getRouteCapacityUseCase.execute(req.validated.params.id);

  return success(res, presentRouteCapacity(result));
});

export const listRouteCapacities = asyncHandler(async (req, res) => {
  const result = await listRouteCapacitiesUseCase.execute(req.validated.query);

  return success(res, presentRouteCapacityList(result));
});

export const RouteCapacityController = {
  createRouteCapacity,
  updateRouteCapacity,
  getRouteCapacity,
  listRouteCapacities,
};
