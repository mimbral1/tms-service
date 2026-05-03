import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const vehicleType = z.enum(['bicycle', 'motorcycle', 'car', 'van', 'truck']);
const vehicleTypeStatus = z.enum(['active', 'inactive']);

export const createVehicleTypeSchema = z.object({
  body: z.object({
    referenceId: z.string().max(100).nullish(),
    name: z.string().max(150),
    type: vehicleType,
    maxShippingQuantity: z.number().int().min(1),
    maxProductQuantity: z.number().int().min(1),
    maxVolume: z.number().min(0),
    maxDistance: z.number().min(0),
    maxWeight: z.number().min(0),
    fuelConsumption: z.number().min(0).nullish(),
    icon: z.string().max(100).nullish(),
    companyId: uuid.nullish(),
    status: vehicleTypeStatus.default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getVehicleTypeSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listVehicleTypesSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: vehicleTypeStatus.optional(),
    type: vehicleType.optional(),
  }),
  headers,
});

export const VehicleTypeSchema = {
  createVehicleTypeSchema,
  getVehicleTypeSchema,
  listVehicleTypesSchema,
};
