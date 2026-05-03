# CONTEXT - TMS Service

## Proposito

El `tms-service` administra la operacion de transporte y ultima milla de Mimbral.

Su responsabilidad es transformar envios listos para despacho en rutas ejecutables, con conductores, vehiculos, planificacion, despacho fisico y tracking.

## Responsabilidades

- Gestionar vehiculos.
- Gestionar tipos de vehiculos.
- Gestionar conductores.
- Gestionar disponibilidad de conductores.
- Crear rutas.
- Asignar conductor a ruta.
- Iniciar ruta.
- Registrar tracking.
- Registrar ubicacion de vehiculo.
- Finalizar o cancelar ruta.
- Gestionar despacho fisico de ruta desde bodega.
- Planificar rutas.
- Definir capacidad logistica.
- Publicar eventos Kafka mediante Outbox.

## No responsabilidades

Este servicio no debe:

- Crear pedidos.
- Reservar stock.
- Facturar.
- Hacer picking.
- Hacer packing.
- Gestionar reclamos.
- Cobrar pagos.

## Servicios relacionados

| Servicio | Relacion |
|---|---|
| OMS Service | Recibe estados logisticos finales |
| Delivery Service | Entrega shippings disponibles |
| WMS Service | Gestiona operacion de bodega |
| Packing Service | Gestiona paquetes |
| Notification Service | Notifica eventos al cliente/equipo |
| Document Service | Genera hojas de ruta |
| User Service | Entrega snapshots de usuarios/conductores |
| Kafka | Comunicacion asincrona |
| SQL Server | Persistencia propia del TMS |

## Regla principal

Cada regla de negocio debe vivir en `domain` o `application`.

Los controllers solo reciben request, validan, llaman casos de uso y responden.

Los repositories solo hablan con SQL Server.

Los listeners solo reciben eventos y delegan logica.

## Documentos relacionados

```txt
ARCHITECTURE.md
DATABASE.md
ENDPOINTS.md
EVENTS.md
KAFKA.md
INTEGRATIONS.md
ROUTE_LIFECYCLE.md
DISPATCH_LIFECYCLE.md
SETUP.md
ENVIRONMENT.md
JOBS_AND_LISTENERS.md
TESTING.md
API_PAYLOADS.md
RUNBOOK.md
```
