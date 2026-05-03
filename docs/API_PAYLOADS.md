# Payloads HTTP - TMS Service

## Vehicle Type

```json
{
  "referenceId": "pickup",
  "name": "Camioneta",
  "type": "van",
  "maxShippingQuantity": 20,
  "maxProductQuantity": 500,
  "maxVolume": 5000000,
  "maxDistance": 120,
  "maxWeight": 1200,
  "fuelConsumption": 0.12,
  "icon": "van",
  "status": "active"
}
```

## Vehicle

```json
{
  "name": "Camioneta Demo 01",
  "plate": "DEMO01",
  "brand": "Toyota",
  "model": "Hilux",
  "year": 2024,
  "capacity": 1200,
  "vehicleTypeId": "11111111-1111-4111-8111-111111111111",
  "status": "active"
}
```

## Vehicle Location

```json
{
  "latitude": -35.4264,
  "longitude": -71.6554,
  "date": "2026-05-03T12:00:00.000Z"
}
```

## Driver

```json
{
  "firstname": "Juan",
  "lastname": "Perez",
  "email": "juan.perez@mimbral.cl",
  "documentNumber": "12345678-9",
  "employeeId": "DRV-001",
  "activeWarehouseId": "44444444-4444-4444-8444-444444444444",
  "warehouseIds": ["44444444-4444-4444-8444-444444444444"],
  "status": "active"
}
```

## Driver Planning

```json
{
  "driverIds": ["33333333-3333-4333-8333-333333333333"],
  "warehouseIds": ["44444444-4444-4444-8444-444444444444"],
  "timeSlots": [
    {
      "availability": "available",
      "dateRange": {
        "from": "2026-05-03T08:00:00.000Z",
        "to": "2026-05-03T18:00:00.000Z"
      }
    }
  ]
}
```

## Route

```json
{
  "driverId": "33333333-3333-4333-8333-333333333333",
  "vehicleId": "22222222-2222-4222-8222-222222222222",
  "vehicleTypeId": "11111111-1111-4111-8111-111111111111",
  "scheduleStart": "2026-05-03T08:00:00.000Z",
  "scheduleEnd": "2026-05-03T18:00:00.000Z",
  "autoSchedule": true,
  "stops": [
    {
      "kind": "warehouse",
      "warehouseId": "44444444-4444-4444-8444-444444444444",
      "address": "Mimbral San Javier",
      "latitude": -35.595,
      "longitude": -71.735,
      "actions": [{ "type": "pickup" }]
    },
    {
      "kind": "customer",
      "address": "Cliente demo",
      "latitude": -35.4264,
      "longitude": -71.6554,
      "actions": [
        {
          "type": "dropoff",
          "shippingId": "66666666-6666-4666-8666-666666666666"
        }
      ]
    }
  ]
}
```

## Start Route

```json
{
  "coordinates": {
    "lat": -35.595,
    "lng": -71.735
  }
}
```

## Route Tracking

```json
[
  {
    "routeStopId": "77777777-7777-4777-8777-777777777777",
    "shippingId": "66666666-6666-4666-8666-666666666666",
    "status": "completed",
    "date": "2026-05-03T12:00:00.000Z",
    "comments": ["Entregado correctamente"],
    "coordinates": {
      "lat": -35.4264,
      "lng": -71.6554
    }
  }
]
```

## Route Dispatch

```json
{
  "routeId": "55555555-5555-4555-8555-555555555555",
  "warehouseId": "44444444-4444-4444-8444-444444444444",
  "routeDisplayId": "RTE-DEMO-001",
  "dispatchDate": "2026-05-03T08:00:00.000Z"
}
```

## Finish Route Dispatch

```json
{
  "packages": [
    {
      "packageId": "88888888-8888-4888-8888-888888888888",
      "shippingId": "66666666-6666-4666-8666-666666666666",
      "scanOrder": 1
    }
  ],
  "signature": null
}
```

## Route Planning

```json
{
  "schedule": {
    "from": "2026-05-03T08:00:00.000Z",
    "to": "2026-05-03T18:00:00.000Z"
  },
  "onlyShippingsReadyForPickup": true,
  "planningConditions": [
    {
      "warehouseId": "44444444-4444-4444-8444-444444444444",
      "shippingTypeIds": [],
      "vehicleConfigurations": {
        "types": [
          {
            "id": "11111111-1111-4111-8111-111111111111",
            "quantity": 2
          }
        ]
      }
    }
  ]
}
```

## Route Capacity

```json
{
  "name": "Capacidad lunes",
  "warehouseId": "44444444-4444-4444-8444-444444444444",
  "dayOfWeek": 1,
  "isActive": true,
  "windows": [
    {
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxRoutes": 5,
      "maxShippings": 100,
      "maxPackages": 150,
      "maxWeight": 1000,
      "maxVolume": 5000000,
      "isActive": true
    }
  ]
}
