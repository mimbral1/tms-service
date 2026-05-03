import { settingsRepository } from '../../../../infrastructure/persistence/repositories/settings.repository.js';
import { asyncHandler } from '../../../../shared/http/asyncHandler.js';
import { success } from '../../../../shared/http/response.js';
import { buildUpdateSettingsInput } from '../../application/dto/settings.input.js';
import { GetSettingsUseCase } from '../../application/use-cases/get-settings.usecase.js';
import { UpdateSettingsUseCase } from '../../application/use-cases/update-settings.usecase.js';

const getSettingsUseCase = new GetSettingsUseCase(settingsRepository);
const updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepository);

export const getSettings = asyncHandler(async (req, res) => {
  const result = await getSettingsUseCase.execute(req.validated.params.entity);

  return success(res, result);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const input = buildUpdateSettingsInput(req.validated.body, req.user);

  const result = await updateSettingsUseCase.execute(
    req.validated.params.entity,
    input,
  );

  return success(res, result);
});

export const SettingsController = {
  getSettings,
  updateSettings,
};
