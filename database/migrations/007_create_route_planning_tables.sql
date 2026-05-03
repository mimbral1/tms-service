CREATE TABLE tms.RoutePlanning (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    DisplayId NVARCHAR(50) NOT NULL,
    ScheduleFrom DATETIME2 NOT NULL,
    ScheduleTo DATETIME2 NOT NULL,
    OnlyShippingsReadyForPickup BIT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'processing',
    WarehouseCount INT NOT NULL DEFAULT 0,
    VehicleTypeCount INT NOT NULL DEFAULT 0,
    RouteCount INT NOT NULL DEFAULT 0,
    ShippingCount INT NOT NULL DEFAULT 0,
    AssignedShippingCount INT NOT NULL DEFAULT 0,
    UnassignedShippingCount INT NOT NULL DEFAULT 0,
    ErrorMessage NVARCHAR(2000) NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT UQ_RoutePlanning_DisplayId UNIQUE (DisplayId),

    CONSTRAINT CK_RoutePlanning_Status CHECK (
        Status IN (
            'processing',
            'pendingConfirmation',
            'cancelled',
            'planningError',
            'creatingRoutes',
            'routesCreated',
            'routesPartiallyCreated',
            'routeCreationFailed'
        )
    ),

    CONSTRAINT CK_RoutePlanning_DateRange CHECK (ScheduleFrom < ScheduleTo)
);
GO

CREATE TABLE tms.RoutePlanningCondition (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RoutePlanningId UNIQUEIDENTIFIER NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,
    ShippingTypeIdsJson NVARCHAR(MAX) NULL,

    CONSTRAINT FK_RoutePlanningCondition_RoutePlanning
        FOREIGN KEY (RoutePlanningId) REFERENCES tms.RoutePlanning(Id)
);
GO

CREATE TABLE tms.RoutePlanningVehicleConfiguration (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RoutePlanningConditionId UNIQUEIDENTIFIER NOT NULL,
    VehicleTypeId UNIQUEIDENTIFIER NOT NULL,
    Quantity INT NULL,
    WindowStart DATETIME2 NULL,
    WindowEnd DATETIME2 NULL,

    CONSTRAINT FK_RoutePlanningVehicleConfiguration_Condition
        FOREIGN KEY (RoutePlanningConditionId) REFERENCES tms.RoutePlanningCondition(Id)
);
GO

CREATE TABLE tms.RoutePlanningRoute (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RoutePlanningId UNIQUEIDENTIFIER NOT NULL,
    RouteId UNIQUEIDENTIFIER NULL,
    VehicleTypeId UNIQUEIDENTIFIER NULL,
    DriverId UNIQUEIDENTIFIER NULL,
    DurationExpected INT NULL,
    StopsJson NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'planned',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_RoutePlanningRoute_RoutePlanning
        FOREIGN KEY (RoutePlanningId) REFERENCES tms.RoutePlanning(Id)
);
GO

CREATE INDEX IX_RoutePlanning_Status
ON tms.RoutePlanning(Status);
GO
