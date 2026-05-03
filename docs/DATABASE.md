# Base de datos - TMS Service

## Esquema

```txt
tms
```

## Tablas

```txt
VehicleType
Vehicle
Driver
DriverWarehouse
DriverPlanning
DriverPlanningWarehouse
Route
RouteStop
RouteStopAction
RouteTracking
RouteVehicleTracking
RouteDispatch
RouteDispatchPackage
RoutePlanning
RoutePlanningCondition
RoutePlanningVehicleConfiguration
RoutePlanningRoute
RouteCapacitySchema
RouteCapacityWindow
Setting
OutboxEvent
```

## Migraciones

Las migraciones se ejecutan en orden lexicografico desde:

```txt
database/migrations
```

Orden actual:

```txt
001_create_schema.sql
002_create_vehicle_tables.sql
003_create_driver_tables.sql
004_create_driver_planning_tables.sql
005_create_route_tables.sql
006_create_route_dispatch_tables.sql
007_create_route_planning_tables.sql
008_create_tracking_tables.sql
009_create_capacity_tables.sql
010_create_settings_tables.sql
011_create_outbox_table.sql
```

Nota: `008_create_tracking_tables.sql` es no-op porque las tablas de tracking viven en `005_create_route_tables.sql`.

## Views

```txt
database/views/vw_route_summary.sql
database/views/vw_driver_availability.sql
database/views/vw_dispatch_summary.sql
```

## Seeds

```txt
database/seeds/vehicle-types.seed.sql
database/seeds/settings.seed.sql
database/seeds/demo.seed.sql
```

## Scripts

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:setup
```

`db:setup` crea base de datos, ejecuta migraciones, views y seeds.

## Regla

El TMS tiene base de datos propia.

No debe consultar tablas internas de otros microservicios.

Las consultas a otros servicios deben hacerse por REST, Kafka o snapshots locales.
