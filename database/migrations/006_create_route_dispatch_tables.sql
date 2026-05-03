CREATE TABLE tms.RouteDispatch (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteId UNIQUEIDENTIFIER NOT NULL,
    WarehouseId UNIQUEIDENTIFIER NOT NULL,
    RouteDisplayId NVARCHAR(50) NOT NULL,
    DispatchDate DATETIME2 NULL,
    DispatcherId UNIQUEIDENTIFIER NULL,
    DispatchStartTime DATETIME2 NULL,
    DispatchEndTime DATETIME2 NULL,
    DispatchDuration INT NULL,
    DispatchToken NVARCHAR(10) NULL,
    Signature NVARCHAR(1000) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'pending',
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_RouteDispatch_Route
        FOREIGN KEY (RouteId) REFERENCES tms.Route(Id),

    CONSTRAINT CK_RouteDispatch_Status
        CHECK (Status IN (
            'pending',
            'readyForDispatch',
            'preparingForDispatch',
            'dispatched',
            'notDispatched'
        ))
);
GO

CREATE TABLE tms.RouteDispatchPackage (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RouteDispatchId UNIQUEIDENTIFIER NOT NULL,
    PackageId UNIQUEIDENTIFIER NOT NULL,
    ShippingId UNIQUEIDENTIFIER NULL,
    ScanOrder INT NULL,
    DateScanned DATETIME2 NULL,

    CONSTRAINT FK_RouteDispatchPackage_RouteDispatch
        FOREIGN KEY (RouteDispatchId) REFERENCES tms.RouteDispatch(Id)
);
GO

CREATE INDEX IX_RouteDispatch_Status
ON tms.RouteDispatch(Status);
GO

CREATE INDEX IX_RouteDispatch_RouteId
ON tms.RouteDispatch(RouteId);
GO

CREATE INDEX IX_RouteDispatchPackage_DispatchId
ON tms.RouteDispatchPackage(RouteDispatchId);
GO
