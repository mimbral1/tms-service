import { driverListOutput } from '../dto/driver.output.js';

export class ListDriversUseCase {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(filters) {
    const drivers = await this.driverRepository.listDrivers(filters);

    return driverListOutput(drivers);
  }
}
