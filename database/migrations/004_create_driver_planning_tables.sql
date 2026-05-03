CREATE TABLE tms.DriverPlanning (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    DriverId UNIQUEIDENTIFIER NOT NULL,
    Availability NVARCHAR(30) NOT NULL,
    DateStart DATETIME2 NOT NULL,
    DateEnd DATETIME2 NOT NULL,
    MotiveId UNIQUEIDENTIFIER NULL,
    Comment NVARCHAR(1000) NULL,
    RouteId UNIQUEIDENTIFIER NULL,
    IsFinished BIT NOT NULL DEFAULT 0,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_DriverPlanning_Driver
        FOREIGN KEY (DriverId) REFERENCES tms.Driver(Id),

    CONSTRAINT CK_DriverPlanning_Availability
        CHECK (Availability IN ('available', 'notAvailable', 'occupied')),

    CONSTRAINT CK_DriverPlanning_DateRange
        CHECK (DateStart < DateEnd)
);
GO

CREATE TABLE tms.DriverPlanningWarehouse (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    DriverPlanningId UNIQUEIDENTIFIER NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,

    CONSTRAINT FK_DriverPlanningWarehouse_DriverPlanning
        FOREIGN KEY (DriverPlanningId) REFERENCES tms.DriverPlanning(Id)
);
GO

CREATE INDEX IX_DriverPlanning_DriverId
ON tms.DriverPlanning(DriverId);
GO

CREATE INDEX IX_DriverPlanning_DateRange
ON tms.DriverPlanning(DateStart, DateEnd);
GO

CREATE INDEX IX_DriverPlanning_Availability
ON tms.DriverPlanning(Availability);
GO
