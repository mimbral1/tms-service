# Integraciones - TMS Service

## Delivery Service

Delivery Service es dueno del envio o `shipping`.

TMS consume eventos:

```txt
delivery.shipping.created
delivery.shipping.ready_for_pickup
delivery.shipping.cancelled
```

TMS puede informar:

```txt
shipping assigned to route
shipping delivered
shipping failed
```

## Packing Service

Packing Service es dueno del paquete.

TMS consume eventos:

```txt
packing.package.created
packing.package.updated
```

TMS puede consultar:

```txt
package detail
```

y marcar:

```txt
packages dispatched
```

## WMS Service

WMS administra la operacion interna de bodega.

TMS informa:

```txt
route_dispatch.started
route_dispatch.finished
```

## OMS Service

OMS es dueno del pedido.

TMS informa estados logisticos finales:

```txt
delivered
failed
cancelled
postponed
```

## Notification Service

TMS puede solicitar notificaciones:

```txt
ruta iniciada
pedido en camino
pedido entregado
entrega fallida
```

## Document Service

TMS puede pedir:

```txt
hoja de ruta
manifiesto de carga
resumen de conductor
```

## User Service

User Service es fuente externa para usuarios y datos del conductor.

TMS consume:

```txt
user.driver.updated
```

TMS puede consultar:

```txt
GET /users/:id
GET /drivers/by-user/:userId
```

El listener actual delega en:

```txt
src/modules/driver/driver-sync.service.js
```

Por ahora sincroniza el snapshot externo y deja preparado el punto para crear, actualizar o desactivar drivers.

## Clientes HTTP

Los clientes activos viven en:

```txt
src/infrastructure/http
```

Los mappers de respuesta viven en:

```txt
src/infrastructure/http/mappers
```

Regla:

```txt
Client = request HTTP
Mapper = normalizar respuesta externa
Integration service = traducir necesidad del modulo a llamada externa
Use Case = decide cuando llamar
```

## Tolerancia a fallos

Las notificaciones externas de tracking y dispatch deben loguear fallos sin revertir el estado local ya persistido.

Si una integracion necesita ser garantizada, debe modelarse con Outbox o una tabla de reintentos.

## Regla de integracion

No mezclar responsabilidades.

TMS coordina transporte, pero no reemplaza OMS, WMS, Packing ni Delivery.
