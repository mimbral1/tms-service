import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import {
  vehicleToDomain,
  vehicleTypeToDomain,
} from '../mappers/vehicle.persistence-mapper.js';

export class VehicleRepository {
  async findVehicleById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.Vehicle
        WHERE Id = @Id
      `);

    return vehicleToDomain(result.recordset[0]);
  }

  async findVehicleTypeById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.VehicleType
        WHERE Id = @Id
      `);

    return vehicleTypeToDomain(result.recordset[0]);
  }

  async createVehicle(vehicle) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, vehicle.id)
      .input('ReferenceId', sql.NVarChar(100), vehicle.referenceId)
      .input('Name', sql.NVarChar(150), vehicle.name)
      .input('CompanyId', sql.UniqueIdentifier, vehicle.companyId)
      .input('Plate', sql.NVarChar(30), vehicle.plate)
      .input('Brand', sql.NVarChar(100), vehicle.brand)
      .input('Model', sql.NVarChar(100), vehicle.model)
      .input('Year', sql.Int, vehicle.year)
      .input('Capacity', sql.Decimal(18, 2), vehicle.capacity)
      .input('VehicleTypeId', sql.UniqueIdentifier, vehicle.vehicleTypeId)
      .input('Status', sql.NVarChar(30), vehicle.status)
      .input('UserCreated', sql.UniqueIdentifier, vehicle.userCreated)
      .query(`
        INSERT INTO tms.Vehicle (
          Id,
          ReferenceId,
          Name,
          CompanyId,
          Plate,
          Brand,
          Model,
          Year,
          Capacity,
          VehicleTypeId,
          Status,
          UserCreated
        )
        VALUES (
          @Id,
          @ReferenceId,
          @Name,
          @CompanyId,
          @Plate,
          @Brand,
          @Model,
          @Year,
          @Capacity,
          @VehicleTypeId,
          @Status,
          @UserCreated
        )
      `);

    return this.findVehicleById(vehicle.id);
  }

  async updateVehicle(vehicle) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, vehicle.id)
      .input('ReferenceId', sql.NVarChar(100), vehicle.referenceId)
      .input('Name', sql.NVarChar(150), vehicle.name)
      .input('CompanyId', sql.UniqueIdentifier, vehicle.companyId)
      .input('Plate', sql.NVarChar(30), vehicle.plate)
      .input('Brand', sql.NVarChar(100), vehicle.brand)
      .input('Model', sql.NVarChar(100), vehicle.model)
      .input('Year', sql.Int, vehicle.year)
      .input('Capacity', sql.Decimal(18, 2), vehicle.capacity)
      .input('VehicleTypeId', sql.UniqueIdentifier, vehicle.vehicleTypeId)
      .input('Status', sql.NVarChar(30), vehicle.status)
      .input('UserModified', sql.UniqueIdentifier, vehicle.userModified)
      .query(`
        UPDATE tms.Vehicle
        SET
          ReferenceId = @ReferenceId,
          Name = @Name,
          CompanyId = @CompanyId,
          Plate = @Plate,
          Brand = @Brand,
          Model = @Model,
          Year = @Year,
          Capacity = @Capacity,
          VehicleTypeId = @VehicleTypeId,
          Status = @Status,
          UserModified = @UserModified,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    return this.findVehicleById(vehicle.id);
  }

  async updateVehicleLocation(vehicle) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, vehicle.id)
      .input('Latitude', sql.Decimal(10, 7), vehicle.lastKnownLatitude)
      .input('Longitude', sql.Decimal(10, 7), vehicle.lastKnownLongitude)
      .input('LocationDate', sql.DateTime2, vehicle.lastKnownLocationDate)
      .query(`
        UPDATE tms.Vehicle
        SET
          LastKnownLatitude = @Latitude,
          LastKnownLongitude = @Longitude,
          LastKnownLocationDate = @LocationDate,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @Id
      `);

    return this.findVehicleById(vehicle.id);
  }

  async listVehicles(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(30), filters.status);
      where.push('Status = @Status');
    }

    if (filters.vehicleTypeId) {
      request.input('VehicleTypeId', sql.UniqueIdentifier, filters.vehicleTypeId);
      where.push('VehicleTypeId = @VehicleTypeId');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.Vehicle
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    return result.recordset.map(vehicleToDomain);
  }

  async createVehicleType(vehicleType) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, vehicleType.id)
      .input('ReferenceId', sql.NVarChar(100), vehicleType.referenceId)
      .input('Name', sql.NVarChar(150), vehicleType.name)
      .input('Type', sql.NVarChar(50), vehicleType.type)
      .input('MaxShippingQuantity', sql.Int, vehicleType.maxShippingQuantity)
      .input('MaxProductQuantity', sql.Int, vehicleType.maxProductQuantity)
      .input('MaxVolume', sql.Decimal(18, 2), vehicleType.maxVolume)
      .input('MaxDistance', sql.Decimal(18, 2), vehicleType.maxDistance)
      .input('MaxWeight', sql.Decimal(18, 2), vehicleType.maxWeight)
      .input('FuelConsumption', sql.Decimal(18, 4), vehicleType.fuelConsumption)
      .input('Icon', sql.NVarChar(100), vehicleType.icon)
      .input('CompanyId', sql.UniqueIdentifier, vehicleType.companyId)
      .input('Status', sql.NVarChar(30), vehicleType.status)
      .input('UserCreated', sql.UniqueIdentifier, vehicleType.userCreated)
      .query(`
        INSERT INTO tms.VehicleType (
          Id,
          ReferenceId,
          Name,
          Type,
          MaxShippingQuantity,
          MaxProductQuantity,
          MaxVolume,
          MaxDistance,
          MaxWeight,
          FuelConsumption,
          Icon,
          CompanyId,
          Status,
          UserCreated
        )
        VALUES (
          @Id,
          @ReferenceId,
          @Name,
          @Type,
          @MaxShippingQuantity,
          @MaxProductQuantity,
          @MaxVolume,
          @MaxDistance,
          @MaxWeight,
          @FuelConsumption,
          @Icon,
          @CompanyId,
          @Status,
          @UserCreated
        )
      `);

    return this.findVehicleTypeById(vehicleType.id);
  }

  async listVehicleTypes(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(30), filters.status);
      where.push('Status = @Status');
    }

    if (filters.type) {
      request.input('Type', sql.NVarChar(50), filters.type);
      where.push('Type = @Type');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.VehicleType
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    return result.recordset.map(vehicleTypeToDomain);
  }
}

export const vehicleRepository = new VehicleRepository();
