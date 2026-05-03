import { servicesConfig } from '../../config/services.config.js';
import { BaseHttpClient, requestJson } from './base-http.client.js';

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

export class WmsClient extends BaseHttpClient {
  constructor(baseUrl = servicesConfig.wmsServiceUrl) {
    super(baseUrl);
  }
}
