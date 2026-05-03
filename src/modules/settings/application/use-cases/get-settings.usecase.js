import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { settingsOutput } from '../dto/settings.output.js';

export class GetSettingsUseCase {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async execute(entity) {
    const setting = await this.settingsRepository.findByEntity(entity);

    if (!setting) {
      throw new NotFoundError('Settings not found');
    }

    return settingsOutput(setting);
  }
}
