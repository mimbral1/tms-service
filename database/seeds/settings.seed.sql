IF NOT EXISTS (SELECT 1 FROM tms.Setting WHERE Entity = 'route')
BEGIN
    INSERT INTO tms.Setting (
        Id,
        Entity,
        SettingsJson
    )
    VALUES (
        NEWID(),
        'route',
        '{
            "eta": {
                "calculate": true,
                "timeMarginBefore": 10,
                "timeMarginAfter": 10
            },
            "dispatch": {
                "dispatchCodeRequired": true,
                "signatureRequired": true
            },
            "tracking": {
                "allowManualTracking": true,
                "requireCoordinates": false
            }
        }'
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM tms.Setting WHERE Entity = 'driver')
BEGIN
    INSERT INTO tms.Setting (
        Id,
        Entity,
        SettingsJson
    )
    VALUES (
        NEWID(),
        'driver',
        '{
            "planning": {
                "useDriverPlanning": true,
                "preventOverlappingRoutes": true
            }
        }'
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM tms.Setting WHERE Entity = 'app')
BEGIN
    INSERT INTO tms.Setting (
        Id,
        Entity,
        SettingsJson
    )
    VALUES (
        NEWID(),
        'app',
        '{
            "serviceName": "tms-service",
            "company": "Mimbral",
            "environment": "development"
        }'
    );
END;
GO
