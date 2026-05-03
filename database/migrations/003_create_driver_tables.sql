CREATE TABLE tms.Driver (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL,
    Firstname NVARCHAR(150) NOT NULL,
    Lastname NVARCHAR(150) NOT NULL,
    Email NVARCHAR(200) NOT NULL,
    DocumentNumber NVARCHAR(50) NULL,
    EmployeeId NVARCHAR(100) NULL,
    ActiveWarehouseId UNIQUEIDENTIFIER NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'active',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT UQ_Driver_Email UNIQUE (Email),
    CONSTRAINT CK_Driver_Status CHECK (Status IN ('active', 'inactive'))
);
GO

CREATE TABLE tms.DriverWarehouse (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    DriverId UNIQUEIDENTIFIER NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_DriverWarehouse_Driver
        FOREIGN KEY (DriverId) REFERENCES tms.Driver(Id),

    CONSTRAINT UQ_DriverWarehouse UNIQUE (DriverId, WarehouseId)
);
GO

CREATE INDEX IX_Driver_Status
ON tms.Driver(Status);
GO

CREATE INDEX IX_DriverWarehouse_DriverId
ON tms.DriverWarehouse(DriverId);
GO

CREATE INDEX IX_DriverWarehouse_WarehouseId
ON tms.DriverWarehouse(WarehouseId);
GO
