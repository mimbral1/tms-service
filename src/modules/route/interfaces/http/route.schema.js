import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const nullableUuid = uuid.nullish();
const routeStatus = z.enum(['created', 'scheduled', 'started', 'finished', 'cancelled', 'error']);

const actionSchema = z.object({
  shippingId: nullableUuid,
  relatedShippingId: nullableUuid,
  type: z.enum(['pickup', 'dropoff', 'finish']),
});

const stopSchema = z.object({
  kind: z.enum(['warehouse', 'customer']),
  warehouseId: nullableUuid,
  address: z.string().max(500),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  actions: z.array(actionSchema).min(1),
});

export const createRouteSchema = z.object({
  body: z.object({
    displayId: z.string().max(50).nullish(),
    companyId: nullableUuid,
    driverId: nullableUuid,
    vehicleId: nullableUuid,
    vehicleTypeId: nullableUuid,
    routePlanningId: nullableUuid,
    scheduleStart: z.coerce.date().nullish(),
    scheduleEnd: z.coerce.date().nullish(),
    autoSchedule: z.boolean().default(true),
    originLat: z.number().min(-90).max(90).nullish(),
    originLng: z.number().min(-180).max(180).nullish(),
    stops: z.array(stopSchema).min(1),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getRouteSchema = z.object({
  body: emptyBody,
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const listRoutesSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: routeStatus.optional(),
    driverId: uuid.optional(),
  }),
  headers,
});

export const assignDriverSchema = z.object({
  body: z.object({ driverId: uuid }),
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const startRouteSchema = z.object({
  body: z.object({
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .nullish(),
  }).default({}),
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const cancelRouteSchema = z.object({
  body: z.object({
    reason: z.string().max(1000).nullish(),
    comment: z.string().max(1000).nullish(),
  }).default({}),
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const trackingSchema = z.object({
  body: z
    .array(
      z.object({
        routeStopId: nullableUuid,
        shippingId: nullableUuid,
        status: z.enum(['onTheWay', 'arrived', 'completed', 'failed', 'postponed']),
        date: z.coerce.date().optional(),
        motiveId: nullableUuid,
        comments: z.array(z.string()).default([]),
        coordinates: z
          .object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
          })
          .nullish(),
      }),
    )
    .min(1),
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

const vehicleTrackingPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  date: z.coerce.date().optional(),
});

export const vehicleTrackingSchema = z.object({
  body: z.union([vehicleTrackingPointSchema, z.array(vehicleTrackingPointSchema)]),
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const RouteSchema = {
  createRouteSchema,
  getRouteSchema,
  listRoutesSchema,
  assignDriverSchema,
  startRouteSchema,
  cancelRouteSchema,
  trackingSchema,
  vehicleTrackingSchema,
};
