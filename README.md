# TMS Service - Mimbral

Microservicio backend para gestion de transporte, rutas, conductores, vehiculos, planificacion logistica, despacho y tracking.

## Stack

```txt
Node.js
Express
JavaScript
SQL Server
Kafka
Outbox Pattern
Clean Code / Clean Architecture
```

## Levantar Local

El SQL del contenedor se expone en `localhost:14330` para no chocar con un SQL Server local que ya use `1433`.

```bash
npm install
npm run infra:up
npm run db:setup
npm run dev
```

Verifica infraestructura:

```bash
npm run infra:ps
```

Debes ver:

```txt
tms-sqlserver
tms-kafka
tms-zookeeper
```

## Modo Sin Docker

Si Docker Desktop no esta instalado o no aparece en PATH, puedes levantar solo Express para probar `/health` y `/api`:

```bash
npm run dev:local
```

Este modo salta SQL Server, Kafka, jobs y listeners. Los endpoints que consultan base de datos responderan error controlado hasta que levantes infraestructura real.

Para detectar Docker:

```bash
npm run infra:check
```

Si Docker esta instalado en una ruta no estandar, define:

```powershell
$env:DOCKER_BIN="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
npm run infra:up
```

## Variables Clave

```env
DB_USER=sa
DB_PASSWORD=YourStrongPassword123
DB_SERVER=localhost
DB_PORT=14330
DB_NAME=TmsServiceDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

KAFKA_BROKERS=localhost:9092
```

## Scripts

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:setup
npm run infra:check
npm run infra:up
npm run infra:down
npm run infra:reset
npm run dev:local
npm test
npm run lint
```

## Responsabilidad Del Servicio

El TMS Service administra:

```txt
Vehiculos
Tipos de vehiculo
Conductores
Disponibilidad de conductores
Rutas
Paradas de ruta
Tracking de ruta
Tracking de vehiculo
Despacho de ruta
Planificacion de rutas
Capacidad logistica
Settings operacionales
Eventos Kafka
```

## Que NO Hace

Este servicio no debe:

```txt
Crear pedidos
Facturar
Reservar stock
Hacer picking
Crear paquetes
Cobrar pagos
Resolver reclamos
```

Eso pertenece a OMS, Finance, Inventory, WMS, Packing, Payment o CSX.

## Estructura Clean Code

```txt
src/
  modules/
    modulo/
      domain/
      application/
        use-cases/
        dto/
        ports/
      interfaces/
        http/
  infrastructure/
    database/
    kafka/
    http/
    http-clients/
    persistence/
  shared/
  outbox/
  bootstrap/
  routes/
```

## Healthcheck

```http
GET http://localhost:4010/health
```

## Rutas Disponibles

```txt
/api/vehicle
/api/vehicle-type
/api/driver
/api/driver-planning
/api/route
/api/route-dispatch
/api/route-planning
/api/route-capacity-schema
/api/setting/:entity
```

## Headers

En desarrollo puedes probar sin `x-api-key`.

Recomendado:

```http
Content-Type: application/json
x-api-key: internal-key
x-user-id: 00000000-0000-0000-0000-000000000000
```

## Orden De Pruebas Recomendado

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
