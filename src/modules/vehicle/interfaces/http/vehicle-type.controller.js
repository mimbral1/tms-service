import { vehicleRepository } from '../../../../infrastructure/persistence/repositories/vehicle.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import { buildCreateVehicleTypeInput } from '../../application/dto/vehicle-type.input.js';
import { CreateVehicleTypeUseCase } from '../../application/use-cases/create-vehicle-type.usecase.js';
import { GetVehicleTypeUseCase } from '../../application/use-cases/get-vehicle-type.usecase.js';
import { ListVehicleTypesUseCase } from '../../application/use-cases/list-vehicle-types.usecase.js';
import {
  presentVehicleType,
  presentVehicleTypeList,
} from './vehicle-type.presenter.js';

const createVehicleTypeUseCase = new CreateVehicleTypeUseCase(vehicleRepository);
const getVehicleTypeUseCase = new GetVehicleTypeUseCase(vehicleRepository);
const listVehicleTypesUseCase = new ListVehicleTypesUseCase(vehicleRepository);

export const createVehicleType = asyncHandler(async (req, res) => {
  const input = buildCreateVehicleTypeInput(req.validated.body, req.user);
  const result = await createVehicleTypeUseCase.execute(input);

  return created(res, presentVehicleType(result));
});

export const getVehicleType = asyncHandler(async (req, res) => {
  const result = await getVehicleTypeUseCase.execute(req.validated.params.id);

  return success(res, presentVehicleType(result));
});

export const listVehicleTypes = asyncHandler(async (req, res) => {
  const result = await listVehicleTypesUseCase.execute(req.validated.query);

  return success(res, presentVehicleTypeList(result));
});

export const VehicleTypeController = {
  createVehicleType,
  getVehicleType,
  listVehicleTypes,
};
