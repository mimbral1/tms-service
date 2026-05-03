CREATE TABLE tms.RouteCapacitySchema (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,
    ShippingTypeId UNIQUEIDENTIFIER NULL,
    VehicleTypeId UNIQUEIDENTIFIER NULL,
    DayOfWeek INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT CK_RouteCapacitySchema_DayOfWeek
        CHECK (DayOfWeek BETWEEN 1 AND 7)
);
GO

CREATE TABLE tms.RouteCapacityWindow (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteCapacitySchemaId UNIQUEIDENTIFIER NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    MaxRoutes INT NOT NULL,
    MaxShippings INT NOT NULL,
    MaxPackages INT NULL,
    MaxWeight DECIMAL(18,2) NULL,
    MaxVolume DECIMAL(18,2) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_RouteCapacityWindow_RouteCapacitySchema
        FOREIGN KEY (RouteCapacitySchemaId)
        REFERENCES tms.RouteCapacitySchema(Id),

    CONSTRAINT CK_RouteCapacityWindow_Time
        CHECK (StartTime < EndTime)
);
GO

CREATE INDEX IX_RouteCapacitySchema_WarehouseId
ON tms.RouteCapacitySchema(WarehouseId);
GO

CREATE INDEX IX_RouteCapacityWindow_SchemaId
ON tms.RouteCapacityWindow(RouteCapacitySchemaId);
GO
