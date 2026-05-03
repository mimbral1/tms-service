CREATE TABLE tms.OutboxEvent (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Topic NVARCHAR(200) NOT NULL,
    EventType NVARCHAR(200) NOT NULL,
    AggregateId UNIQUEIDENTIFIER NULL,
    PayloadJson NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'pending',
    RetryCount INT NOT NULL DEFAULT 0,
    LastError NVARCHAR(MAX) NULL,
    ProcessingStartedAt DATETIME2 NULL,
    PublishedAt DATETIME2 NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT CK_OutboxEvent_Status
        CHECK (Status IN ('pending', 'processing', 'published', 'failed'))
);
GO

CREATE INDEX IX_OutboxEvent_Status_DateCreated
ON tms.OutboxEvent(Status, DateCreated);
GO
