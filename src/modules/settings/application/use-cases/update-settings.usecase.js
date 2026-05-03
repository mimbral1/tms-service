import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { settingsOutput } from '../dto/settings.output.js';

export class UpdateSettingsUseCase {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async execute(entity, input) {
    const current = await this.settingsRepository.findByEntity(entity);

    if (!current) {
      throw new NotFoundError('Settings not found');
    }

    const updated = await this.settingsRepository.updateByEntity(entity, input);

    return settingsOutput(updated);
  }
}
