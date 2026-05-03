CREATE TABLE tms.VehicleType (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ReferenceId NVARCHAR(100) NULL,
    Name NVARCHAR(150) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    MaxShippingQuantity INT NOT NULL,
    MaxProductQuantity INT NOT NULL,
    MaxVolume DECIMAL(18,2) NOT NULL,
    MaxDistance DECIMAL(18,2) NOT NULL,
    MaxWeight DECIMAL(18,2) NOT NULL,
    FuelConsumption DECIMAL(18,4) NULL,
    Icon NVARCHAR(100) NULL,
    CompanyId UNIQUEIDENTIFIER NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'active',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT CK_VehicleType_Type
        CHECK (Type IN ('bicycle', 'motorcycle', 'car', 'van', 'truck')),

    CONSTRAINT CK_VehicleType_Status
        CHECK (Status IN ('active', 'inactive'))
);
GO

CREATE TABLE tms.Vehicle (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    ReferenceId NVARCHAR(100) NULL,
    Name NVARCHAR(150) NOT NULL,
    CompanyId UNIQUEIDENTIFIER NULL,
    Plate NVARCHAR(30) NOT NULL,
    Brand NVARCHAR(100) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    Capacity DECIMAL(18,2) NOT NULL,
    VehicleTypeId UNIQUEIDENTIFIER NOT NULL,
    LastKnownLatitude DECIMAL(10,7) NULL,
    LastKnownLongitude DECIMAL(10,7) NULL,
    LastKnownLocationDate DATETIME2 NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'active',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_Vehicle_VehicleType
        FOREIGN KEY (VehicleTypeId) REFERENCES tms.VehicleType(Id),

    CONSTRAINT UQ_Vehicle_Plate UNIQUE (Plate),

    CONSTRAINT CK_Vehicle_Status
        CHECK (Status IN ('active', 'inactive', 'error'))
);
GO

CREATE INDEX IX_Vehicle_Status
ON tms.Vehicle(Status);
GO

CREATE INDEX IX_Vehicle_VehicleTypeId
ON tms.Vehicle(VehicleTypeId);
GO
