import { driverRepository } from '../../../../infrastructure/persistence/repositories/driver.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { created, success } from '../../../../shared/http/response.js';
import { buildCreateDriverInput } from '../../application/dto/driver.input.js';
import { CreateDriverUseCase } from '../../application/use-cases/create-driver.usecase.js';
import { GetDriverUseCase } from '../../application/use-cases/get-driver.usecase.js';
import { ListAvailableDriversUseCase } from '../../application/use-cases/list-available-drivers.usecase.js';
import { ListDriversUseCase } from '../../application/use-cases/list-drivers.usecase.js';
import { presentDriver, presentDriverList } from './driver.presenter.js';

const createDriverUseCase = new CreateDriverUseCase(driverRepository);
const getDriverUseCase = new GetDriverUseCase(driverRepository);
const listDriversUseCase = new ListDriversUseCase(driverRepository);
const listAvailableDriversUseCase = new ListAvailableDriversUseCase(driverRepository);

export const createDriver = asyncHandler(async (req, res) => {
  const input = buildCreateDriverInput(req.validated.body, req.user);
  const result = await createDriverUseCase.execute(input);

  return created(res, presentDriver(result));
});

export const getDriver = asyncHandler(async (req, res) => {
  const result = await getDriverUseCase.execute(req.validated.params.id);

  return success(res, presentDriver(result));
});

export const listDrivers = asyncHandler(async (req, res) => {
  const result = await listDriversUseCase.execute(req.validated.query);

  return success(res, presentDriverList(result));
});

export const listAvailableDrivers = asyncHandler(async (req, res) => {
  const result = await listAvailableDriversUseCase.execute(req.validated.query);

  return success(res, presentDriverList(result));
});

export const DriverController = {
  createDriver,
  getDriver,
  listDrivers,
  listAvailableDrivers,
};
