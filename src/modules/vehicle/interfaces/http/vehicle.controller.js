import { outboxRepository } from '../../../../infrastructure/persistence/repositories/outbox.repository.js';
import { vehicleRepository } from '../../../../infrastructure/persistence/repositories/vehicle.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import {
  buildCreateVehicleInput,
  buildUpdateVehicleInput,
  buildUpdateVehicleLocationInput,
} from '../../application/dto/vehicle.input.js';
import { CreateVehicleUseCase } from '../../application/use-cases/create-vehicle.usecase.js';
import { GetVehicleUseCase } from '../../application/use-cases/get-vehicle.usecase.js';
import { ListVehiclesUseCase } from '../../application/use-cases/list-vehicles.usecase.js';
import { UpdateVehicleLocationUseCase } from '../../application/use-cases/update-vehicle-location.usecase.js';
import { UpdateVehicleUseCase } from '../../application/use-cases/update-vehicle.usecase.js';
import { presentVehicle, presentVehicleList } from './vehicle.presenter.js';

const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const getVehicleUseCase = new GetVehicleUseCase(vehicleRepository);
const listVehiclesUseCase = new ListVehiclesUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const updateVehicleLocationUseCase = new UpdateVehicleLocationUseCase(
  vehicleRepository,
  outboxRepository,
);

export const createVehicle = asyncHandler(async (req, res) => {
  const input = buildCreateVehicleInput(req.validated.body, req.user);
  const result = await createVehicleUseCase.execute(input);

  return created(res, presentVehicle(result));
});

export const getVehicle = asyncHandler(async (req, res) => {
  const result = await getVehicleUseCase.execute(req.validated.params.id);

  return success(res, presentVehicle(result));
});

export const listVehicles = asyncHandler(async (req, res) => {
  const result = await listVehiclesUseCase.execute(req.validated.query);

  return success(res, presentVehicleList(result));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const input = buildUpdateVehicleInput(req.validated.body, req.user);

  const result = await updateVehicleUseCase.execute(
    req.validated.params.id,
    input,
  );

  return success(res, presentVehicle(result));
});

export const updateVehicleLocation = asyncHandler(async (req, res) => {
  const input = buildUpdateVehicleLocationInput(req.validated.body);

  const result = await updateVehicleLocationUseCase.execute(
    req.validated.params.id,
    input,
  );

  return success(res, presentVehicle(result));
});

export const VehicleController = {
  createVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
  updateVehicleLocation,
};
