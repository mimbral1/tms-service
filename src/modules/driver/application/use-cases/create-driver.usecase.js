import { generateId } from '../../../../shared/utils/id.util.js';
import { Driver } from '../../domain/Driver.js';
import { driverOutput } from '../dto/driver.output.js';

export class CreateDriverUseCase {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(input) {
    const driver = new Driver({
      id: generateId(),
      ...input,
    });

    const created = await this.driverRepository.createDriver(driver);

    return driverOutput(created);
  }
}
