import { generateId } from '../../../shared/utils/id.util.js';
import { getSqlServerPool, sql } from '../../database/sqlserver.connection.js';
import { driverToDomain } from '../mappers/driver.persistence-mapper.js';

export class DriverRepository {
  async createDriver(driver) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('Id', sql.UniqueIdentifier, driver.id)
      .input('UserId', sql.UniqueIdentifier, driver.userId)
      .input('Firstname', sql.NVarChar(150), driver.firstname)
      .input('Lastname', sql.NVarChar(150), driver.lastname)
      .input('Email', sql.NVarChar(200), driver.email)
      .input('DocumentNumber', sql.NVarChar(50), driver.documentNumber)
      .input('EmployeeId', sql.NVarChar(100), driver.employeeId)
      .input('ActiveWarehouseId', sql.UniqueIdentifier, driver.activeWarehouseId)
      .input('Status', sql.NVarChar(30), driver.status)
      .input('UserCreated', sql.UniqueIdentifier, driver.userCreated)
      .query(`
        INSERT INTO tms.Driver (
          Id,
          UserId,
          Firstname,
          Lastname,
          Email,
          DocumentNumber,
          EmployeeId,
          ActiveWarehouseId,
          Status,
          UserCreated
        )
        VALUES (
          @Id,
          @UserId,
          @Firstname,
          @Lastname,
          @Email,
          @DocumentNumber,
          @EmployeeId,
          @ActiveWarehouseId,
          @Status,
          @UserCreated
        )
      `);

    if (driver.warehouseIds?.length) {
      await this.assignDriverWarehouses(driver.id, driver.warehouseIds);
    }

    return this.findDriverById(driver.id);
  }

  async findDriverById(id) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('Id', sql.UniqueIdentifier, id)
      .query(`
        SELECT *
        FROM tms.Driver
        WHERE Id = @Id
      `);

    const row = result.recordset[0];

    if (!row) return null;

    const warehouseIds = await this.findDriverWarehouseIds(id);

    return driverToDomain(row, warehouseIds);
  }

  async findDriverWarehouseIds(driverId) {
    const pool = getSqlServerPool();

    const result = await pool
      .request()
      .input('DriverId', sql.UniqueIdentifier, driverId)
      .query(`
        SELECT WarehouseId
        FROM tms.DriverWarehouse
        WHERE DriverId = @DriverId
          AND IsActive = 1
      `);

    return result.recordset.map((row) => row.WarehouseId);
  }

  async assignDriverWarehouses(driverId, warehouseIds = []) {
    const pool = getSqlServerPool();

    await pool
      .request()
      .input('DriverId', sql.UniqueIdentifier, driverId)
      .query(`
        DELETE FROM tms.DriverWarehouse
        WHERE DriverId = @DriverId
      `);

    for (const warehouseId of warehouseIds) {
      await pool
        .request()
        .input('Id', sql.UniqueIdentifier, generateId())
        .input('DriverId', sql.UniqueIdentifier, driverId)
        .input('WarehouseId', sql.UniqueIdentifier, warehouseId)
        .query(`
          INSERT INTO tms.DriverWarehouse (
            Id,
            DriverId,
            WarehouseId
          )
          VALUES (
            @Id,
            @DriverId,
            @WarehouseId
          )
        `);
    }

    await pool
      .request()
      .input('DriverId', sql.UniqueIdentifier, driverId)
      .input('ActiveWarehouseId', sql.UniqueIdentifier, warehouseIds[0] || null)
      .query(`
        UPDATE tms.Driver
        SET
          ActiveWarehouseId = @ActiveWarehouseId,
          DateModified = SYSUTCDATETIME()
        WHERE Id = @DriverId
      `);
  }

  async listDrivers(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();
    const where = [];

    if (filters.status) {
      request.input('Status', sql.NVarChar(30), filters.status);
      where.push('Status = @Status');
    }

    if (filters.email) {
      request.input('Email', sql.NVarChar(200), filters.email);
      where.push('Email = @Email');
    }

    const result = await request.query(`
      SELECT *
      FROM tms.Driver
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY DateCreated DESC
    `);

    const drivers = [];

    for (const row of result.recordset) {
      const warehouseIds = await this.findDriverWarehouseIds(row.Id);
      drivers.push(driverToDomain(row, warehouseIds));
    }

    return drivers;
  }

  async listAvailableDrivers(filters = {}) {
    const pool = getSqlServerPool();
    const request = pool.request();

    const warehouseIds = filters.warehouseIds || [];
    const dateFrom = filters.dateFrom || new Date();
    const dateTo = filters.dateTo || new Date();

    request.input('DateFrom', sql.DateTime2, dateFrom);
    request.input('DateTo', sql.DateTime2, dateTo);

    const warehouseFilter = warehouseIds.length
      ? `AND dw.WarehouseId IN (${warehouseIds
          .map((_, index) => `@WarehouseId${index}`)
          .join(',')})`
      : '';

    warehouseIds.forEach((warehouseId, index) => {
      request.input(`WarehouseId${index}`, sql.UniqueIdentifier, warehouseId);
    });

    const result = await request.query(`
      SELECT DISTINCT d.*
      FROM tms.Driver d
      INNER JOIN tms.DriverWarehouse dw ON dw.DriverId = d.Id
      LEFT JOIN tms.DriverPlanning dp
        ON dp.DriverId = d.Id
        AND dp.DateStart <= @DateTo
        AND dp.DateEnd >= @DateFrom
        AND dp.Availability IN ('notAvailable', 'occupied')
      WHERE
        d.Status = 'active'
        AND dp.Id IS NULL
        ${warehouseFilter}
      ORDER BY d.Firstname ASC
    `);

    const drivers = [];

    for (const row of result.recordset) {
      const assignedWarehouses = await this.findDriverWarehouseIds(row.Id);
      drivers.push(driverToDomain(row, assignedWarehouses));
    }

    return drivers;
  }
}

export const driverRepository = new DriverRepository();
