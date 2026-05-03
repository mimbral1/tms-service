import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();

export const createVehicleSchema = z.object({
  body: z.object({
    referenceId: z.string().max(100).nullish(),
    name: z.string().max(150),
    companyId: uuid.nullish(),
    plate: z.string().max(30),
    brand: z.string().max(100),
    model: z.string().max(100),
    year: z.number().int().min(1900).max(2100),
    capacity: z.number().min(0),
    vehicleTypeId: uuid,
    status: z.enum(['active', 'inactive', 'error']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getVehicleSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const updateVehicleSchema = z.object({
  body: z.object({
    referenceId: z.string().max(100).nullish(),
    name: z.string().max(150),
    companyId: uuid.nullish(),
    plate: z.string().max(30),
    brand: z.string().max(100),
    model: z.string().max(100),
    year: z.number().int().min(1900).max(2100),
    capacity: z.number().min(0),
    vehicleTypeId: uuid,
    status: z.enum(['active', 'inactive', 'error']).default('active'),
  }),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listVehiclesSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: z.enum(['active', 'inactive', 'error']).optional(),
    vehicleTypeId: uuid.optional(),
  }),
  headers,
});

export const updateVehicleLocationSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    date: z.coerce.date().optional(),
  }),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const VehicleSchema = {
  createVehicleSchema,
  getVehicleSchema,
  updateVehicleSchema,
  listVehiclesSchema,
  updateVehicleLocationSchema,
};
