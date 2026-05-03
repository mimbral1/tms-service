import { env } from './env.config.js';

export const servicesConfig = {
  oms: env.services.oms,
  delivery: env.services.delivery,
  wms: env.services.wms,
  packing: env.services.packing,
  notification: env.services.notification,
  document: env.services.document,
  user: env.services.user,
  omsServiceUrl: env.services.oms,
  deliveryServiceUrl: env.services.delivery,
  wmsServiceUrl: env.services.wms,
  packingServiceUrl: env.services.packing,
  notificationServiceUrl: env.services.notification,
  documentServiceUrl: env.services.document,
  userServiceUrl: env.services.user,
};
