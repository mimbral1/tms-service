import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const status = z.enum([
  'processing',
  'pendingConfirmation',
  'cancelled',
  'planningError',
  'creatingRoutes',
  'routesCreated',
  'routesPartiallyCreated',
  'routeCreationFailed',
]);

const vehicleConfigurationSchema = z.object({
  id: uuid,
  quantity: z.number().int().min(1),
});

const planningConditionSchema = z.object({
  warehouseId: uuid,
  shippingTypeIds: z.array(uuid).default([]),
  vehicleConfigurations: z.object({
    types: z.array(vehicleConfigurationSchema).min(1),
  }),
});

const actionSchema = z.object({
  shippingId: uuid.nullish(),
  relatedShippingId: uuid.nullish(),
  type: z.enum(['pickup', 'dropoff', 'finish']),
});

const stopSchema = z.object({
  kind: z.enum(['warehouse', 'customer']),
  warehouseId: uuid.nullish(),
  address: z.string().max(500),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  actions: z.array(actionSchema).min(1),
});

const plannedRouteSchema = z.object({
  id: uuid.nullish(),
  vehicleTypeId: uuid.nullish(),
  driverId: uuid.nullish(),
  duration: z
    .object({
      expected: z.number().int().min(0),
    })
    .nullish(),
  stops: z.array(stopSchema).min(1),
});

export const createRoutePlanningSchema = z.object({
  body: z.object({
    schedule: z.object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    }),
    planningConditions: z.array(planningConditionSchema).min(1),
    onlyShippingsReadyForPickup: z.boolean().nullish(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getRoutePlanningSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listRoutePlanningsSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: status.optional(),
  }),
  headers,
});

export const confirmRoutePlanningSchema = z.object({
  body: z.object({
    routingConfirmed: z.boolean().default(false),
    routes: z.array(plannedRouteSchema).optional(),
  }),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const RoutePlanningSchema = {
  createRoutePlanningSchema,
  getRoutePlanningSchema,
  listRoutePlanningsSchema,
  confirmRoutePlanningSchema,
};
