# Endpoints - TMS Service

Base URL:

```txt
http://localhost:4010/api
```

Healthcheck:

```http
GET /health
```

Headers recomendados:

```http
Content-Type: application/json
x-api-key: internal-key
x-user-id: 00000000-0000-0000-0000-000000000000
```

En `NODE_ENV=development`, `x-api-key` no es obligatorio.

## Vehicle Type

```http
GET /vehicle-type
POST /vehicle-type
GET /vehicle-type/:id
```

## Vehicle

```http
GET /vehicle
POST /vehicle
GET /vehicle/:id
PUT /vehicle/:id
PATCH /vehicle/:id/location
```

## Driver

```http
GET /driver
POST /driver
GET /driver/available
GET /driver/:id
```

## Driver Planning

```http
GET /driver-planning
POST /driver-planning
PUT /driver-planning/:id
DELETE /driver-planning/:id
```

## Route

```http
GET /route
POST /route
GET /route/:id
POST /route/:id/assign-driver
POST /route/:id/start
POST /route/:id/finish
POST /route/:id/cancel
POST /route/:id/tracking
PATCH /route/:id/vehicle-tracking
```

## Route Dispatch

```http
GET /route-dispatch
POST /route-dispatch
GET /route-dispatch/:id
POST /route-dispatch/:id/ready
POST /route-dispatch/:id/start
POST /route-dispatch/:id/finish
```

## Route Planning

```http
GET /route-planning
POST /route-planning
GET /route-planning/:id
POST /route-planning/:id/process
POST /route-planning/:id/confirm
```

## Route Capacity

```http
GET /route-capacity-schema
POST /route-capacity-schema
GET /route-capacity-schema/:id
PUT /route-capacity-schema/:id
```

## Settings

```http
GET /setting/:entity
PUT /setting/:entity
```

Entidades seed:

```txt
route
driver
app
```

## Respuesta estandar

Exito:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": []
  },
  "requestId": "uuid"
}
```
