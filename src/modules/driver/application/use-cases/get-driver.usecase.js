import { NotFoundError } from '../../../../shared/errors/NotFoundError.js';
import { driverOutput } from '../dto/driver.output.js';

export class GetDriverUseCase {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(id) {
    const driver = await this.driverRepository.findDriverById(id);

    if (!driver) {
      throw new NotFoundError('Driver not found');
    }

    return driverOutput(driver);
  }
}
