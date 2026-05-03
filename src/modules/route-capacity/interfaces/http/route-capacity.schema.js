import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const envBoolean = z.preprocess((value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return value;
}, z.boolean());

const windowSchema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  maxRoutes: z.number().int().min(1),
  maxShippings: z.number().int().min(1),
  maxPackages: z.number().int().min(0).nullish(),
  maxWeight: z.number().min(0).nullish(),
  maxVolume: z.number().min(0).nullish(),
  isActive: z.boolean().default(true),
});

const capacityBody = z.object({
  name: z.string().max(150),
  warehouseId: uuid,
  shippingTypeId: uuid.nullish(),
  vehicleTypeId: uuid.nullish(),
  dayOfWeek: z.number().int().min(1).max(7),
  isActive: z.boolean().default(true),
  windows: z.array(windowSchema).min(1),
});

export const createRouteCapacitySchema = z.object({
  body: capacityBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const updateRouteCapacitySchema = z.object({
  body: capacityBody,
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const getRouteCapacitySchema = z.object({
  body: emptyBody,
  params: z.object({ id: uuid }),
  query: z.object({}).passthrough(),
  headers,
});

export const listRouteCapacitySchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    warehouseId: uuid.optional(),
    dayOfWeek: z.coerce.number().int().min(1).max(7).optional(),
    isActive: envBoolean.optional(),
  }),
  headers,
});

export const RouteCapacitySchema = {
  createRouteCapacitySchema,
  updateRouteCapacitySchema,
  getRouteCapacitySchema,
  listRouteCapacitySchema,
};
