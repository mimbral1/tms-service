import { Vehicle } from '../../../modules/vehicle/domain/Vehicle.js';
import { VehicleType } from '../../../modules/vehicle/domain/VehicleType.js';

export function vehicleToDomain(row) {
  if (!row) return null;

  return new Vehicle({
    id: row.Id,
    referenceId: row.ReferenceId,
    name: row.Name,
    companyId: row.CompanyId,
    plate: row.Plate,
    brand: row.Brand,
    model: row.Model,
    year: row.Year,
    capacity: row.Capacity,
    vehicleTypeId: row.VehicleTypeId,
    lastKnownLatitude: row.LastKnownLatitude,
    lastKnownLongitude: row.LastKnownLongitude,
    lastKnownLocationDate: row.LastKnownLocationDate,
    status: row.Status,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export function vehicleTypeToDomain(row) {
  if (!row) return null;

  return new VehicleType({
    id: row.Id,
    referenceId: row.ReferenceId,
    name: row.Name,
    type: row.Type,
    maxShippingQuantity: row.MaxShippingQuantity,
    maxProductQuantity: row.MaxProductQuantity,
    maxVolume: row.MaxVolume,
    maxDistance: row.MaxDistance,
    maxWeight: row.MaxWeight,
    fuelConsumption: row.FuelConsumption,
    icon: row.Icon,
    companyId: row.CompanyId,
    status: row.Status,
    dateCreated: row.DateCreated,
    dateModified: row.DateModified,
    userCreated: row.UserCreated,
    userModified: row.UserModified,
  });
}

export const VehiclePersistenceMapper = {
  toDomain: vehicleToDomain,
  vehicleToDomain,
  vehicleTypeToDomain,
};
