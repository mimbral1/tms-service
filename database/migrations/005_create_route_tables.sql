CREATE TABLE tms.Route (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    DisplayId NVARCHAR(50) NOT NULL,
    CompanyId UNIQUEIDENTIFIER NULL,
    DriverId UNIQUEIDENTIFIER NULL,
    VehicleId UNIQUEIDENTIFIER NULL,
    VehicleTypeId UNIQUEIDENTIFIER NULL,
    RoutePlanningId UNIQUEIDENTIFIER NULL,
    ScheduleStart DATETIME2 NULL,
    ScheduleEnd DATETIME2 NULL,
    AutoSchedule BIT NOT NULL DEFAULT 1,
    Status NVARCHAR(30) NOT NULL DEFAULT 'created',
    DateStarted DATETIME2 NULL,
    DateFinished DATETIME2 NULL,
    OriginLat DECIMAL(10,7) NULL,
    OriginLng DECIMAL(10,7) NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT UQ_Route_DisplayId UNIQUE (DisplayId),

    CONSTRAINT FK_Route_Driver
        FOREIGN KEY (DriverId) REFERENCES tms.Driver(Id),

    CONSTRAINT FK_Route_Vehicle
        FOREIGN KEY (VehicleId) REFERENCES tms.Vehicle(Id),

    CONSTRAINT CK_Route_Status
        CHECK (Status IN ('created', 'scheduled', 'started', 'finished', 'cancelled', 'error'))
);
GO

CREATE TABLE tms.RouteStop (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteId UNIQUEIDENTIFIER NOT NULL,
    Kind NVARCHAR(30) NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NULL,
    Address NVARCHAR(500) NOT NULL,
    Latitude DECIMAL(10,7) NULL,
    Longitude DECIMAL(10,7) NULL,
    Position INT NOT NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_RouteStop_Route
        FOREIGN KEY (RouteId) REFERENCES tms.Route(Id),

    CONSTRAINT CK_RouteStop_Kind
        CHECK (Kind IN ('warehouse', 'customer'))
);
GO

CREATE TABLE tms.RouteStopAction (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteStopId UNIQUEIDENTIFIER NOT NULL,
    ShippingId UNIQUEIDENTIFIER NULL,
    RelatedShippingId UNIQUEIDENTIFIER NULL,
    Type NVARCHAR(30) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'pending',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,

    CONSTRAINT FK_RouteStopAction_RouteStop
        FOREIGN KEY (RouteStopId) REFERENCES tms.RouteStop(Id),

    CONSTRAINT CK_RouteStopAction_Type
        CHECK (Type IN ('pickup', 'dropoff', 'finish')),

    CONSTRAINT CK_RouteStopAction_Status
        CHECK (Status IN ('pending', 'onTheWay', 'arrived', 'completed', 'failed', 'postponed'))
);
GO

CREATE TABLE tms.RouteTracking (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteId UNIQUEIDENTIFIER NOT NULL,
    RouteStopId UNIQUEIDENTIFIER NULL,
    ShippingId UNIQUEIDENTIFIER NULL,
    Status NVARCHAR(30) NOT NULL,
    CommentsJson NVARCHAR(MAX) NULL,
    Latitude DECIMAL(10,7) NULL,
    Longitude DECIMAL(10,7) NULL,
    EventDate DATETIME2 NOT NULL,
    UserId UNIQUEIDENTIFIER NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_RouteTracking_Route
        FOREIGN KEY (RouteId) REFERENCES tms.Route(Id)
);
GO

CREATE TABLE tms.RouteVehicleTracking (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteId UNIQUEIDENTIFIER NOT NULL,
    Latitude DECIMAL(10,7) NOT NULL,
    Longitude DECIMAL(10,7) NOT NULL,
    EventDate DATETIME2 NOT NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_RouteVehicleTracking_Route
        FOREIGN KEY (RouteId) REFERENCES tms.Route(Id)
);
GO

CREATE INDEX IX_Route_Status ON tms.Route(Status);
GO

CREATE INDEX IX_Route_DriverId ON tms.Route(DriverId);
GO

CREATE INDEX IX_RouteStop_RouteId ON tms.RouteStop(RouteId);
GO

CREATE INDEX IX_RouteTracking_RouteId ON tms.RouteTracking(RouteId);
GO
