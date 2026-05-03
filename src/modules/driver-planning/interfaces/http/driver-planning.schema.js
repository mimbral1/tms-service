import { z } from 'zod';

const emptyBody = z.object({}).passthrough().optional();
const headers = z.object({}).passthrough();
const uuid = z.string().uuid();
const availability = z.enum(['available', 'notAvailable', 'occupied']);
const editableAvailability = z.enum(['available', 'notAvailable']);

const envBoolean = z.preprocess((value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return value;
}, z.boolean());

function requireMotiveWhenNotAvailable(value, context) {
  if (value.availability === 'notAvailable' && !value.motiveId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'motiveId is required when availability is notAvailable',
      path: ['motiveId'],
    });
  }
}

const timeSlotSchema = z
  .object({
    availability: editableAvailability,
    dateRange: z.object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    }),
    motiveId: uuid.nullish(),
    comment: z.string().max(1000).nullish(),
  })
  .superRefine(requireMotiveWhenNotAvailable);

export const createDriverPlanningSchema = z.object({
  body: z.object({
    driverIds: z.array(uuid).min(1),
    warehouseIds: z.array(uuid).min(1),
    timeSlots: z.array(timeSlotSchema).min(1),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  headers,
});

export const updateDriverPlanningSchema = z.object({
  body: z
    .object({
      driverId: uuid,
      warehouseIds: z.array(uuid).min(1),
      availability: editableAvailability,
      dateStart: z.coerce.date(),
      dateEnd: z.coerce.date(),
      motiveId: uuid.nullish(),
      comment: z.string().max(1000).nullish(),
    })
    .superRefine(requireMotiveWhenNotAvailable),
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const deleteDriverPlanningSchema = z.object({
  body: emptyBody,
  params: z.object({
    id: uuid,
  }),
  query: z.object({}).passthrough(),
  headers,
});

export const listDriverPlanningSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: z.object({
    driverId: uuid.optional(),
    availability: availability.optional(),
    isFinished: envBoolean.optional(),
  }),
  headers,
});

export const DriverPlanningSchema = {
  createDriverPlanningSchema,
  updateDriverPlanningSchema,
  deleteDriverPlanningSchema,
  listDriverPlanningSchema,
};
