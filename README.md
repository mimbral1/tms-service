# TMS Service - Mimbral

Microservicio backend para gestión de transporte, rutas, conductores, vehículos, planificación logística, despacho y tracking.

---

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

---

## Responsabilidad del Servicio

El **TMS Service** administra la operación de transporte y última milla.

Administra:

```txt
Vehículos
Tipos de vehículo
Conductores
Disponibilidad de conductores
Rutas
Paradas de ruta
Tracking de ruta
Tracking de vehículo
Despacho de ruta
Planificación de rutas
Capacidad logística
Settings operacionales
Eventos Kafka de transporte
```

---

## Qué NO hace este servicio

Este servicio no debe:

```txt
Crear pedidos
Facturar
Reservar stock
Hacer picking
Crear paquetes
Cobrar pagos
Resolver reclamos
Gestionar devoluciones físicas
```

Eso pertenece a otros microservicios:

```txt
OMS Service        = pedidos
Finance Service    = facturación / SAP
Inventory Service  = stock
WMS Service        = bodega
Picking Service    = picking
Packing Service    = paquetes
Payment Service    = pagos
CSX Service        = reclamos postventa
RMS Service        = devoluciones físicas
```

---

## Arquitectura general

```txt
Canales / OMS / Delivery
        ↓
   TMS Service
        ↓
Rutas · Conductores · Vehículos · Tracking · Despacho
        ↓
Kafka Events / Outbox Pattern
```

El TMS recibe o consulta información necesaria para transportar pedidos, pero no debe transformarse en dueño del pedido, del stock ni de la facturación.

---

## Estructura Clean Code

```txt
src/
  app.js
  server.js
  bootstrap/
    database.bootstrap.js
    kafka.bootstrap.js
    jobs.bootstrap.js
    listeners.bootstrap.js
  config/
    database.config.js
    env.config.js
    kafka.config.js
    logger.config.js
  interfaces/
    http/
      health.routes.js
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
      sqlserver.connection.js
      sqlserver.transaction.js
    kafka/
    http/
    http-clients/
    persistence/
  outbox/
  routes/
    index.routes.js
  shared/
    domain/
    errors/
    http/
    middleware/
    utils/
```

---

## Principios de diseño

### 1. Separación de responsabilidades

Cada módulo debe tener una responsabilidad clara.

Ejemplo:

```txt
vehicle           = vehículos
vehicle-type      = tipos de vehículo
driver            = conductores
driver-planning   = disponibilidad / planificación de conductores
route             = rutas
route-dispatch    = despacho de rutas
route-planning    = planificación de rutas
route-capacity    = capacidad logística
settings          = configuraciones operacionales
```

---

### 2. Application no debe depender directamente de Express

Los casos de uso no deben conocer `req`, `res`, headers HTTP ni rutas.

Correcto:

```txt
Controller HTTP
  → DTO/Input
  → Use Case
  → Repository
```

Incorrecto:

```txt
Use Case
  → req.body
  → res.json
```

---

### 3. Cambios de negocio + eventos deben ser transaccionales

Cuando una acción cambia datos importantes y genera un evento, ambas cosas deben ocurrir juntas.

Ejemplo:

```txt
Actualizar ubicación de vehículo
        +
Crear evento Outbox vehicle.location_updated
```

Debe ejecutarse dentro de una misma transacción SQL.

Si falla el evento, también debe fallar el cambio de negocio.

---

### 4. Kafka no se publica directo desde el caso de uso

El caso de uso no debe publicar directamente en Kafka.

Correcto:

```txt
Use Case
  → guarda evento en Outbox
  → Job Outbox publica a Kafka
```

Incorrecto:

```txt
Use Case
  → actualiza base de datos
  → publica directamente a Kafka
```

---

## Levantar Local con Docker

El SQL Server del contenedor se expone en `localhost:14330` para no chocar con un SQL Server local que ya use `1433`.

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

---

## Modo sin Docker

Si Docker Desktop no está instalado o no aparece en PATH, puedes levantar solo Express para probar `/health`, `/live`, `/ready` y `/api`.

```bash
npm run dev:local
```

Este modo salta SQL Server, Kafka, jobs y listeners.

Los endpoints que consultan base de datos responderán error controlado hasta que levantes infraestructura real.

Para detectar Docker:

```bash
npm run infra:check
```

Si Docker está instalado en una ruta no estándar, define:

```powershell
$env:DOCKER_BIN="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
npm run infra:up
```

---

## Variables clave

```env
NODE_ENV=development
PORT=4010
SERVICE_NAME=tms-service
DB_USER=sa
DB_PASSWORD=YourStrongPassword123
DB_SERVER=localhost
DB_PORT=14330
DB_NAME=TmsServiceDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
KAFKA_CLIENT_ID=tms-service
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=tms-service-group
INTERNAL_API_KEY=internal-key
SKIP_DATABASE_BOOTSTRAP=false
SKIP_KAFKA_BOOTSTRAP=false
SKIP_JOBS_BOOTSTRAP=false
SKIP_LISTENERS_BOOTSTRAP=false
```

---

## Seguridad interna

En desarrollo puedes probar sin `x-api-key`.

En ambientes distintos a `development`, el servicio debe exigir:

```http
x-api-key: internal-key
```

El valor debe coincidir con:

```env
INTERNAL_API_KEY=internal-key
```

Headers recomendados:

```http
Content-Type: application/json
x-api-key: internal-key
x-user-id: 00000000-0000-0000-0000-000000000000
```

---

## Scripts disponibles

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:setup
npm run infra:check
npm run infra:up
npm run infra:down
npm run infra:reset
npm run infra:ps
npm run dev
npm run dev:local
npm run start
npm run start:local
npm test
npm run lint
```

---

## Healthchecks

```http
GET http://localhost:4010/health
GET http://localhost:4010/live
GET http://localhost:4010/ready
```

Uso recomendado:

```txt
/health = el servicio responde
/live   = el proceso está vivo
/ready  = SQL Server y Kafka están disponibles
```

### Ejemplo `/health`

```json
{
  "success": true,
  "service": "tms-service",
  "status": "healthy",
  "timestamp": "2026-05-03T00:00:00.000Z"
}
```

### Ejemplo `/ready`

```json
{
  "success": true,
  "service": "tms-service",
  "status": "ready",
  "checks": {
    "database": {
      "success": true,
      "status": "connected"
    },
    "kafka": {
      "success": true,
      "status": "connected"
    }
  },
  "timestamp": "2026-05-03T00:00:00.000Z"
}
```

---

## Rutas disponibles

```txt
/api
/api/status
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

---

## Orden de pruebas recomendado

```txt
1. GET /health
2. GET /live
3. GET /ready
4. GET /api
5. GET /api/status
6. GET /api/setting/route
7. POST /api/vehicle-type
8. POST /api/vehicle
9. POST /api/driver
10. POST /api/driver-planning
11. GET /api/driver/available
12. POST /api/route
13. POST /api/route/:id/start
14. POST /api/route/:id/tracking
15. POST /api/route/:id/finish
16. POST /api/route-dispatch
17. POST /api/route-planning
18. POST /api/route-capacity-schema
```

---

## Ejemplo de request

### Crear tipo de vehículo

```http
POST http://localhost:4010/api/vehicle-type
Content-Type: application/json
x-api-key: internal-key
x-user-id: 00000000-0000-0000-0000-000000000000
```

```json
{
  "referenceId": "TRUCK_SMALL",
  "name": "Camión pequeño",
  "type": "TRUCK",
  "maxShippingQuantity": 20,
  "maxProductQuantity": 200,
  "maxVolume": 15.5,
  "maxDistance": 150,
  "maxWeight": 1200,
  "fuelConsumption": 8.5,
  "icon": "truck",
  "companyId": "00000000-0000-0000-0000-000000000000",
  "status": "active"
}
```

---

## Outbox Pattern

El TMS usa Outbox Pattern para evitar perder eventos.

Flujo:

```txt
1. Caso de uso ejecuta regla de negocio
2. Se actualiza SQL Server
3. Se inserta evento en tms.OutboxEvent
4. Job de Outbox lee eventos pendientes
5. Job publica eventos en Kafka
6. Evento queda marcado como published
```

Ejemplo:

```txt
PATCH /api/vehicle/:id/location
        ↓
Vehicle.updateLocation()
        ↓
UPDATE tms.Vehicle
        ↓
INSERT tms.OutboxEvent
        ↓
Kafka topic: tms.vehicle.location.updated
```

---

## Eventos principales esperados

```txt
tms.vehicle.location.updated
tms.route.created
tms.route.started
tms.route.tracking.updated
tms.route.finished
tms.route.cancelled
tms.driver.assigned
tms.driver.unassigned
tms.dispatch.created
tms.dispatch.started
tms.dispatch.completed
```

---

## Validaciones importantes

El servicio debe validar:

```txt
Vehículo existe
Tipo de vehículo existe
Conductor existe
Conductor disponible
Vehículo disponible
Ruta existe
Ruta puede iniciar
Ruta puede finalizar
Paradas pertenecen a la ruta
Estados válidos
Coordenadas válidas
Capacidad máxima permitida
```

---

## Estados sugeridos

### Vehículo

```txt
active
inactive
maintenance
error
```

### Conductor

```txt
active
inactive
available
busy
blocked
```

### Ruta

```txt
created
planned
assigned
started
in_transit
finished
cancelled
failed
```

### Outbox

```txt
pending
processing
published
failed
```

---

## Testing básico

Ejecutar tests:

```bash
npm test
```

Validar sintaxis principal:

```bash
npm run lint
```

---

## Comandos útiles

Levantar app sin Docker:

```bash
npm run dev:local
```

Levantar infraestructura:

```bash
npm run infra:up
```

Reiniciar infraestructura:

```bash
npm run infra:reset
```

Configurar base de datos:

```bash
npm run db:setup
```

---

## Reglas de mantenimiento

Cada vez que se agregue un módulo nuevo, actualizar:

```txt
README.md
docs/ENDPOINTS.md si existe
docs/ARCHITECTURE.md si existe
routes/index.routes.js
scripts/db.setup.js o migraciones correspondientes
tests/
```

Cada endpoint nuevo debe tener:

```txt
Route
Controller
Schema de validación
DTO/Input
Use Case
Repository
Presenter
Errores controlados
Tests básicos
```

---

## Nota operativa

Este servicio es parte de una arquitectura retail omnicanal. Debe mantenerse enfocado en transporte.

Si una funcionalidad empieza a parecer pedido, stock, picking, packing, pago, facturación, reclamo o devolución, probablemente no pertenece al TMS Service.
