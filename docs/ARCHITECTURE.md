# Arquitectura - TMS Service

## Estilo

Este backend sigue una separacion tipo Clean Code / Clean Architecture:

```txt
interfaces/http
    ->
application/use-cases
    ->
domain
    ->
infrastructure/persistence
```

En codigo, las dependencias se inyectan desde `interfaces/http` hacia los casos de uso. Los casos de uso reciben repositorios concretos, pero deben depender del contrato documentado en `application/ports`.

## Capas

### Domain

Contiene entidades y reglas puras del negocio.

Ejemplos:

```txt
Route
RouteDispatch
Driver
Vehicle
RoutePlanning
RouteCapacity
```

### Application

Contiene casos de uso.

Ejemplos:

```txt
create-route.usecase.js
start-route.usecase.js
finish-route-dispatch.usecase.js
process-route-planning.usecase.js
```

Tambien contiene:

```txt
dto
ports
services
```

Los `ports` documentan los metodos esperados por los casos de uso. Si un repositorio cambia, primero debe revisarse el port correspondiente.

### Interfaces

Contiene adaptadores de entrada HTTP.

```txt
routes
controllers
schemas
presenters
```

### Infrastructure

Contiene adaptadores externos.

```txt
SQL Server
Kafka
HTTP clients
repositories
persistence mappers
```

### Bootstrap

El arranque vive en:

```txt
src/server.js
src/bootstrap/database.bootstrap.js
src/bootstrap/kafka.bootstrap.js
src/bootstrap/jobs.bootstrap.js
src/bootstrap/listeners.bootstrap.js
```

El orden normal es:

```txt
database -> kafka producer -> jobs -> listeners -> express
```

En modo local sin infraestructura se puede saltar con:

```txt
SKIP_DATABASE_BOOTSTRAP=true
SKIP_KAFKA_BOOTSTRAP=true
SKIP_JOBS_BOOTSTRAP=true
SKIP_LISTENERS_BOOTSTRAP=true
```

## Flujo general

```txt
Delivery Service
      ->
shipping.ready_for_pickup
      ->
TMS Route Planning
      ->
Route
      ->
Route Dispatch
      ->
Driver starts route
      ->
Tracking
      ->
Route finished
      ->
Kafka events / OMS / Delivery
```

## Outbox Pattern

Los casos de uso no publican directamente a Kafka.

Primero guardan eventos en:

```txt
tms.OutboxEvent
```

Luego el job:

```txt
src/outbox/jobs/outbox-publisher.job.js
```

publica a Kafka.

Esto evita perder eventos si SQL confirma pero Kafka falla.

## Principio de independencia

El TMS no consulta tablas internas de otros microservicios.

Debe comunicarse por:

```txt
REST API
Kafka events
Snapshots locales
```

## Regla de integraciones externas

Las integraciones REST no deben reemplazar el estado propio del TMS.

Si una notificacion externa falla despues de guardar un cambio local, el flujo local no debe quedar bloqueado salvo que el caso de uso requiera respuesta inmediata del servicio externo.
