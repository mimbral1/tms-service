import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envBoolean = z.preprocess((value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return value;
}, z.boolean());

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4010),
    SERVICE_NAME: z.string().default('tms-service'),

    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_SERVER: z.string().optional(),
    DB_PORT: z.coerce.number().optional(),
    DB_NAME: z.string().optional(),
    DB_ENCRYPT: envBoolean.optional(),
    DB_TRUST_SERVER_CERTIFICATE: envBoolean.optional(),

    SQLSERVER_USER: z.string().optional(),
    SQLSERVER_PASSWORD: z.string().optional(),
    SQLSERVER_HOST: z.string().optional(),
    SQLSERVER_PORT: z.coerce.number().optional(),
    SQLSERVER_DATABASE: z.string().optional(),
    SQLSERVER_ENCRYPT: envBoolean.optional(),
    SQLSERVER_TRUST_SERVER_CERTIFICATE: envBoolean.optional(),

    KAFKA_CLIENT_ID: z.string().default('tms-service'),
    KAFKA_BROKERS: z.string().default('localhost:9092'),
    KAFKA_GROUP_ID: z.string().default('tms-service-group'),

    INTERNAL_API_KEY: z.string().optional(),

    SKIP_DATABASE_BOOTSTRAP: envBoolean.default(false),
    SKIP_KAFKA_BOOTSTRAP: envBoolean.default(false),
    SKIP_JOBS_BOOTSTRAP: envBoolean.default(false),
    SKIP_LISTENERS_BOOTSTRAP: envBoolean.default(false),

    OMS_SERVICE_URL: z.string().url().optional(),
    DELIVERY_SERVICE_URL: z.string().url().optional(),
    WMS_SERVICE_URL: z.string().url().optional(),
    PACKING_SERVICE_URL: z.string().url().optional(),
    NOTIFICATION_SERVICE_URL: z.string().url().optional(),
    DOCUMENT_SERVICE_URL: z.string().url().optional(),
    USER_SERVICE_URL: z.string().url().optional(),
  })
  .passthrough();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');

  throw new Error(`Environment validation error: ${message}`);
}

const value = parsedEnv.data;

export const env = {
  nodeEnv: value.NODE_ENV,
  port: value.PORT,
  serviceName: value.SERVICE_NAME,

  database: {
    user: value.DB_USER ?? value.SQLSERVER_USER ?? 'sa',
    password: value.DB_PASSWORD ?? value.SQLSERVER_PASSWORD ?? '',
    server: value.DB_SERVER ?? value.SQLSERVER_HOST ?? 'localhost',
    port: value.DB_PORT ?? value.SQLSERVER_PORT ?? 1433,
    database: value.DB_NAME ?? value.SQLSERVER_DATABASE ?? 'tms_service',
    options: {
      encrypt: value.DB_ENCRYPT ?? value.SQLSERVER_ENCRYPT ?? false,
      trustServerCertificate:
        value.DB_TRUST_SERVER_CERTIFICATE ??
        value.SQLSERVER_TRUST_SERVER_CERTIFICATE ??
        true,
    },
  },

  kafka: {
    clientId: value.KAFKA_CLIENT_ID,
    brokers: value.KAFKA_BROKERS.split(',').map((broker) => broker.trim()),
    groupId: value.KAFKA_GROUP_ID,
  },

  auth: {
    internalApiKey: value.INTERNAL_API_KEY,
  },

services: {

  services: {
    oms: value.OMS_SERVICE_URL,
    delivery: value.DELIVERY_SERVICE_URL,
    wms: value.WMS_SERVICE_URL,
    packing: value.PACKING_SERVICE_URL,
    notification: value.NOTIFICATION_SERVICE_URL,
    document: value.DOCUMENT_SERVICE_URL,
    user: value.USER_SERVICE_URL,
  },

  bootstrap: {
    skipDatabase: value.SKIP_DATABASE_BOOTSTRAP,
    skipKafka: value.SKIP_KAFKA_BOOTSTRAP,
    skipJobs: value.SKIP_JOBS_BOOTSTRAP,
    skipListeners: value.SKIP_LISTENERS_BOOTSTRAP,
  },
};
