import { driverListOutput } from '../dto/driver.output.js';

export class ListAvailableDriversUseCase {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(filters) {
    const warehouseIds = Array.isArray(filters.warehouseIds)
      ? filters.warehouseIds
      : String(filters.warehouseIds || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

    const drivers = await this.driverRepository.listAvailableDrivers({
      warehouseIds,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });

    return driverListOutput(drivers);
  }
}
