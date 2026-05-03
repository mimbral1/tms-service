IF NOT EXISTS (SELECT 1 FROM tms.VehicleType WHERE Name = 'Camioneta')
BEGIN
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
        NEWID(),
        'pickup',
        'Camioneta',
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
GO

IF NOT EXISTS (SELECT 1 FROM tms.VehicleType WHERE Name = 'Camión 3/4')
BEGIN
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
        NEWID(),
        'truck-34',
        'Camión 3/4',
        'truck',
        40,
        1500,
        15000000,
        180,
        3500,
        0.20,
        'truck',
        'active'
    );
END;
GO
