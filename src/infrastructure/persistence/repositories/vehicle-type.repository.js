import { BaseRepository } from './base.repository.js';

export class VehicleTypeRepository extends BaseRepository {
  constructor() {
    super('tms.VehicleType');
  }
}

export const vehicleTypeRepository = new VehicleTypeRepository();
