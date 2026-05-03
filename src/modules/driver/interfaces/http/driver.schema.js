import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const driverStatus = z.enum(['active', 'inactive']);

export const createDriverSchema = z.object({
  body: z.object({
    userId: uuid.nullish(),
    firstname: z.string().max(150),
    lastname: z.string().max(150),
    email: z.string().email().max(200),
    documentNumber: z.string().max(50).nullish(),
    employeeId: z.string().max(100).nullish(),
    activeWarehouseId: uuid.nullish(),
    warehouseIds: z.array(uuid).default([]),
    status: driverStatus.default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const getDriverSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listDriversSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    status: driverStatus.optional(),
    email: z.string().email().optional(),
  }),
  headers,
});

const warehouseIdsQuery = z.union([
  z.string().min(1),
  z.array(uuid),
]);

export const listAvailableDriversSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    warehouseIds: warehouseIdsQuery,
    dateFrom: z.coerce.date(),
    dateTo: z.coerce.date(),
  }),
  headers,
});

export const DriverSchema = {
  createDriverSchema,
  getDriverSchema,
  listDriversSchema,
  listAvailableDriversSchema,
};
