import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const status = z.enum([
  'pending',
  'readyForDispatch',
  'preparingForDispatch',
  'dispatched',
  'notDispatched',
]);

export const createRouteDispatchSchema = z.object({
  body: z.object({
    routeId: uuid,
    warehouseId: uuid,
    routeDisplayId: z.string().max(50),
    dispatchDate: z.coerce.date().nullish(),
    status: status.default('pending'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getRouteDispatchSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listRouteDispatchesSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: status.optional(),
    warehouseId: uuid.optional(),
    routeId: uuid.optional(),
  }),
  headers,
});

export const startRouteDispatchSchema = z.object({
  body: z.object({
    dispatcherId: uuid.nullish(),
  }).default({}),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const finishRouteDispatchSchema = z.object({
  body: z.object({
    packageIds: z.array(uuid).default([]),
    packages: z
      .array(
        z.object({
          packageId: uuid,
          shippingId: uuid.nullish(),
          scanOrder: z.number().int().min(1),
        }),
      )
      .default([]),
    signature: z.string().max(1000).nullish(),
  }),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const RouteDispatchSchema = {
  createRouteDispatchSchema,
  getRouteDispatchSchema,
  listRouteDispatchesSchema,
  startRouteDispatchSchema,
  finishRouteDispatchSchema,
};
