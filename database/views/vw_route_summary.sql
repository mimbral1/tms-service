CREATE OR ALTER VIEW tms.vw_route_summary AS
SELECT
    r.Id,
    r.DisplayId,
    r.CompanyId,
    r.DriverId,
    d.Firstname + ' ' + d.Lastname AS DriverName,
    r.VehicleId,
    v.Name AS VehicleName,
    r.VehicleTypeId,
    r.RoutePlanningId,
    r.ScheduleStart,
    r.ScheduleEnd,
    r.AutoSchedule,
    r.Status,
    r.DateStarted,
    r.DateFinished,
    r.OriginLat,
    r.OriginLng,
    COUNT(DISTINCT rs.Id) AS StopsQuantity,
    COUNT(DISTINCT rsa.ShippingId) AS ShippingQuantity,
    r.DateCreated,
    r.DateModified
FROM tms.Route r
LEFT JOIN tms.Driver d
    ON d.Id = r.DriverId
LEFT JOIN tms.Vehicle v
    ON v.Id = r.VehicleId
LEFT JOIN tms.RouteStop rs
    ON rs.RouteId = r.Id
LEFT JOIN tms.RouteStopAction rsa
    ON rsa.RouteStopId = rs.Id
GROUP BY
    r.Id,
    r.DisplayId,
    r.CompanyId,
    r.DriverId,
    d.Firstname,
    d.Lastname,
    r.VehicleId,
    v.Name,
    r.VehicleTypeId,
    r.RoutePlanningId,
    r.ScheduleStart,
    r.ScheduleEnd,
    r.AutoSchedule,
    r.Status,
    r.DateStarted,
    r.DateFinished,
    r.OriginLat,
    r.OriginLng,
    r.DateCreated,
    r.DateModified;
GO
