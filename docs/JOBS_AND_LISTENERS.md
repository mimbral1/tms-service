# Jobs y listeners - TMS Service

## Jobs

Los jobs se inicializan desde:

```txt
src/bootstrap/jobs.bootstrap.js
```

## Jobs activos

| Job | Archivo | Intervalo |
|---|---|---|
| Outbox publisher | `src/outbox/jobs/outbox-publisher.job.js` | 5s |
| Route alerts | `src/jobs/route-alerts.job.js` | 60s |
| Route ETA | `src/jobs/route-eta.job.js` | 120s |
| Route planning processor | `src/jobs/route-planning-processor.job.js` | 30s |
| Driver availability sync | `src/jobs/driver-availability-sync.job.js` | 60s |

Cada job usa guard `isRunning` para evitar ejecuciones solapadas.

## Outbox publisher

Flujo:

```txt
get pending events
mark processing
publish Kafka
mark published
mark pending/failed on error
```

Despues de 5 reintentos el evento queda `failed`.

## Listeners

Los listeners se inicializan desde:

```txt
src/bootstrap/listeners.bootstrap.js
src/listeners/index.js
```

## Topics consumidos

```txt
delivery.shipping.created
delivery.shipping.ready_for_pickup
delivery.shipping.cancelled
packing.package.created
packing.package.updated
user.driver.updated
```

## Regla de listener

```txt
Listener = recibir evento + metadata
Use Case / Service = logica de negocio
Repository = persistencia
```

No agregar reglas complejas dentro del listener.

## Desactivar en desarrollo

```env
SKIP_JOBS_BOOTSTRAP=true
SKIP_LISTENERS_BOOTSTRAP=true
```
