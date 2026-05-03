CREATE TABLE tms.Setting (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Entity NVARCHAR(100) NOT NULL,
    SettingsJson NVARCHAR(MAX) NOT NULL,
    DateCreated DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DateModified DATETIME2 NULL,
    UserCreated UNIQUEIDENTIFIER NULL,
    UserModified UNIQUEIDENTIFIER NULL,

    CONSTRAINT UQ_Setting_Entity UNIQUE (Entity),
    CONSTRAINT CK_Setting_Entity CHECK (Entity IN ('driver', 'route', 'app'))
);
GO
