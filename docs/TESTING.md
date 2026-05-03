# Testing - TMS Service

## Comandos

```bash
npm test
npm run lint
```

`npm test` usa el runner nativo de Node:

```txt
node --test
```

## Tipos de test

```txt
tests/unit
tests/integration
tests/fixtures
```

## Unit tests

Cubren comportamiento de dominio y casos de uso aislados:

```txt
Vehicle
Driver
Route
RouteDispatch
RoutePlanning
UpdateVehicleUseCase
```

## Integration tests

Cubren Express sin levantar el servidor real:

```txt
GET /health
GET /api
GET /api/driver
GET /api/route
GET /api/route-dispatch
```

Cuando no hay SQL Server inicializado, algunos endpoints aceptan `500` para validar que Express responde con error controlado.

## Prueba funcional manual

Orden recomendado:

```txt
1. GET /health
2. GET /api
3. GET /api/setting/route
4. POST /api/vehicle-type
5. POST /api/vehicle
6. POST /api/driver
7. POST /api/driver-planning
8. GET /api/driver/available
9. POST /api/route
10. POST /api/route/:id/start
11. POST /api/route/:id/tracking
12. POST /api/route/:id/finish
13. POST /api/route-dispatch
14. POST /api/route-planning
15. POST /api/route-capacity-schema
```

## Verificar outbox

```sql
SELECT *
FROM tms.OutboxEvent
ORDER BY DateCreated DESC;
```

Estados esperados:

```txt
pending -> processing -> published
```
