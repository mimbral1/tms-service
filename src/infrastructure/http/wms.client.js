import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function notifyRouteDispatchStarted(payload) {
  return requestJson(`${servicesConfig.wmsServiceUrl}/route-dispatch/started`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function notifyRouteDispatchFinished(payload) {
  return requestJson(`${servicesConfig.wmsServiceUrl}/route-dispatch/finished`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const wmsClient = {
  notifyRouteDispatchStarted,
  notifyRouteDispatchFinished,
};
