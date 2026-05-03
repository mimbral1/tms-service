# Kafka - TMS Service

## Eventos publicados

```txt
tms.vehicle.location_updated

tms.route.created
tms.route.scheduled
tms.route.driver_assigned
tms.route.started
tms.route.finished
tms.route.cancelled

tms.route_dispatch.ready
tms.route_dispatch.started
tms.route_dispatch.finished

tms.route_planning.created
tms.route_planning.processed
tms.route_planning.confirmed
tms.route_planning.routes_created

tms.driver_planning.created
tms.driver_planning.updated
tms.driver.occupied
tms.driver.released
```

## Eventos consumidos

```txt
delivery.shipping.created
delivery.shipping.ready_for_pickup
delivery.shipping.cancelled

packing.package.created
packing.package.updated

user.driver.updated
```

## Formato estandar de evento

```json
{
  "id": "uuid-event",
  "eventType": "route.started",
  "aggregateId": "uuid-route",
  "payload": {
    "routeId": "uuid-route",
    "displayId": "RTE-260503-ABC123"
  },
  "occurredAt": "2026-05-03T12:00:00.000Z",
  "service": "tms-service"
}
```

## Regla

Kafka se usa para comunicar hechos que ya ocurrieron.

Ejemplos:

```txt
route.started
route.finished
route_dispatch.finished
vehicle.location_updated
```

REST se usa cuando el TMS necesita una respuesta inmediata.

Ejemplos:

```txt
Consultar detalle de shipping
Consultar paquete
Notificar estado critico
```

## Outbox

Estados:

```txt
pending
processing
published
failed
```

Flujo:

```txt
Use Case
  ->
OutboxEvent pending
  ->
Outbox Publisher Job
  ->
Kafka
  ->
OutboxEvent published
```

## Topics tecnicos

El archivo fuente de verdad es:

```txt
src/infrastructure/kafka/kafka.topics.js
```

Tambien existen topics genericos mantenidos por compatibilidad:

```txt
tms.route.events
tms.dispatch.events
tms.vehicle.events
```

La recomendacion es usar topics especificos por evento para evitar consumers con filtros demasiado amplios.

## Consumer group

```txt
KAFKA_GROUP_ID=tms-service-group
```

Los listeners se registran en:

```txt
src/listeners/index.js
```

Regla:

```txt
Listener = recibir evento, loguear metadata y delegar a caso de uso/servicio
```
