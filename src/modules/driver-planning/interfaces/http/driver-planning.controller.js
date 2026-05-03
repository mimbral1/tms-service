import { driverPlanningRepository } from '../../../../infrastructure/persistence/repositories/driver-planning.repository.js';
import { driverRepository } from '../../../../infrastructure/persistence/repositories/driver.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import {
  buildCreateDriverPlanningInput,
  buildUpdateDriverPlanningInput,
} from '../../application/dto/driver-planning.input.js';
import { CreateDriverPlanningUseCase } from '../../application/use-cases/create-driver-planning.usecase.js';
import { DeleteDriverPlanningUseCase } from '../../application/use-cases/delete-driver-planning.usecase.js';
import { ListDriverPlanningUseCase } from '../../application/use-cases/list-driver-planning.usecase.js';
import { UpdateDriverPlanningUseCase } from '../../application/use-cases/update-driver-planning.usecase.js';
import {
  presentDriverPlanning,
  presentDriverPlanningList,
} from './driver-planning.presenter.js';

const createDriverPlanningUseCase = new CreateDriverPlanningUseCase(
  driverPlanningRepository,
  driverRepository,
);

const updateDriverPlanningUseCase = new UpdateDriverPlanningUseCase(
  driverPlanningRepository,
  driverRepository,
);

const deleteDriverPlanningUseCase = new DeleteDriverPlanningUseCase(
  driverPlanningRepository,
);

const listDriverPlanningUseCase = new ListDriverPlanningUseCase(
  driverPlanningRepository,
);

export const createDriverPlanning = asyncHandler(async (req, res) => {
  const input = buildCreateDriverPlanningInput(req.validated.body, req.user);
  const result = await createDriverPlanningUseCase.execute(input);

  return created(res, presentDriverPlanningList(result));
});

export const updateDriverPlanning = asyncHandler(async (req, res) => {
  const input = buildUpdateDriverPlanningInput(req.validated.body, req.user);

  const result = await updateDriverPlanningUseCase.execute(
    req.validated.params.id,
    input,
  );

  return success(res, presentDriverPlanning(result));
});

export const deleteDriverPlanning = asyncHandler(async (req, res) => {
  const result = await deleteDriverPlanningUseCase.execute(req.validated.params.id);

  return success(res, result);
});

export const listDriverPlanning = asyncHandler(async (req, res) => {
  const result = await listDriverPlanningUseCase.execute(req.validated.query);

  return success(res, presentDriverPlanningList(result));
});

export const DriverPlanningController = {
  createDriverPlanning,
  updateDriverPlanning,
  deleteDriverPlanning,
  listDriverPlanning,
};
