DECLARE @VehicleTypeId UNIQUEIDENTIFIER;
DECLARE @VehicleId UNIQUEIDENTIFIER;
DECLARE @DriverId UNIQUEIDENTIFIER;
DECLARE @WarehouseId UNIQUEIDENTIFIER;

SET @WarehouseId = '11111111-1111-1111-1111-111111111111';

SELECT TOP 1 @VehicleTypeId = Id
FROM tms.VehicleType
WHERE Name = 'Camioneta';

IF @VehicleTypeId IS NULL
BEGIN
    SET @VehicleTypeId = NEWID();

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
        Status
    )
    VALUES (
        @VehicleTypeId,
        'demo-van',
        'Camioneta Demo',
        'van',
        20,
        500,
        5000000,
        120,
        1200,
        0.12,
        'van',
        'active'
    );
END;

IF NOT EXISTS (SELECT 1 FROM tms.Vehicle WHERE Plate = 'DEMO01')
BEGIN
    SET @VehicleId = NEWID();

    INSERT INTO tms.Vehicle (
        Id,
        Name,
        Plate,
        Brand,
        Model,
        Year,
        Capacity,
        VehicleTypeId,
        Status
    )
    VALUES (
        @VehicleId,
        'Camioneta Demo 01',
        'DEMO01',
        'Toyota',
        'Hilux',
        2024,
        1200,
        @VehicleTypeId,
        'active'
    );
END
ELSE
BEGIN
    SELECT @VehicleId = Id
    FROM tms.Vehicle
    WHERE Plate = 'DEMO01';
END;

IF NOT EXISTS (SELECT 1 FROM tms.Driver WHERE Email = 'driver.demo@mimbral.cl')
BEGIN
    SET @DriverId = NEWID();

    INSERT INTO tms.Driver (
        Id,
        Firstname,
        Lastname,
        Email,
        DocumentNumber,
        EmployeeId,
        ActiveWarehouseId,
        Status
    )
    VALUES (
        @DriverId,
        'Conductor',
        'Demo',
        'driver.demo@mimbral.cl',
        '11111111-1',
        'DRV-DEMO-001',
        @WarehouseId,
        'active'
    );

    INSERT INTO tms.DriverWarehouse (
        Id,
        DriverId,
        WarehouseId
    )
    VALUES (
        NEWID(),
        @DriverId,
        @WarehouseId
    );
END;
GO
