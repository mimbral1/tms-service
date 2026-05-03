import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const entity = z.enum(['driver', 'route', 'app']);

export const getSettingsSchema = z.object({
  body: emptyBody,
  params: z.object({ entity }),
  query: z.object({}).passthrough(),
  headers,
});

export const updateSettingsSchema = z.object({
  body: z.record(z.any()),
  params: z.object({ entity }),
  query: z.object({}).passthrough(),
  headers,
});

export const SettingsSchema = {
  getSettingsSchema,
  updateSettingsSchema,
};
