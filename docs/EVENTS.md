# Eventos Kafka - TMS Service

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

## Payload minimo recomendado

```json
{
  "id": "uuid-event",
  "eventType": "route.started",
  "aggregateId": "uuid-route",
  "payload": {},
  "occurredAt": "2026-05-03T12:00:00.000Z",
  "service": "tms-service"
}
```

## Patron Outbox

Los eventos no se publican directo desde el caso de uso.

Primero se guardan en:

```txt
tms.OutboxEvent
```

Luego el job:

```txt
src/outbox/jobs/outbox-publisher.job.js
```

los publica a Kafka.

## Estados Outbox

```txt
pending
processing
published
failed
```

## Reintentos

El publisher toma eventos `pending`, los marca `processing`, intenta publicar en Kafka y luego:

```txt
success -> published
error   -> pending o failed
```

Despues de 5 intentos el evento queda `failed`.
