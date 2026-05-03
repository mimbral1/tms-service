IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'tms')
BEGIN
    EXEC('CREATE SCHEMA tms');
END;
GO
