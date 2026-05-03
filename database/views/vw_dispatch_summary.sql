CREATE OR ALTER VIEW tms.vw_dispatch_summary AS
SELECT
    rd.Id,
    rd.RouteId,
    rd.WarehouseId,
    rd.RouteDisplayId,
    rd.DispatchDate,
    rd.DispatcherId,
    rd.DispatchStartTime,
    rd.DispatchEndTime,
    rd.DispatchDuration,
    rd.DispatchToken,
    rd.Signature,
    rd.Status,
    COUNT(DISTINCT rdp.PackageId) AS PackageCount,
    COUNT(DISTINCT rdp.ShippingId) AS ShippingCount,
    rd.DateCreated,
    rd.DateModified
FROM tms.RouteDispatch rd
LEFT JOIN tms.RouteDispatchPackage rdp
    ON rdp.RouteDispatchId = rd.Id
GROUP BY
    rd.Id,
    rd.RouteId,
    rd.WarehouseId,
    rd.RouteDisplayId,
    rd.DispatchDate,
    rd.DispatcherId,
    rd.DispatchStartTime,
    rd.DispatchEndTime,
    rd.DispatchDuration,
    rd.DispatchToken,
    rd.Signature,
    rd.Status,
    rd.DateCreated,
    rd.DateModified;
GO
