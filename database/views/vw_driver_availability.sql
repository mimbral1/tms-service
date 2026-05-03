CREATE OR ALTER VIEW tms.vw_driver_availability AS
SELECT
    dp.Id,
    dp.DriverId,
    d.Firstname,
    d.Lastname,
    d.Email,
    dp.Availability,
    dp.DateStart,
    dp.DateEnd,
    dp.MotiveId,
    dp.Comment,
    dp.RouteId,
    dp.IsFinished,
    dp.DateCreated,
    dp.DateModified
FROM tms.DriverPlanning dp
INNER JOIN tms.Driver d
    ON d.Id = dp.DriverId;
GO
