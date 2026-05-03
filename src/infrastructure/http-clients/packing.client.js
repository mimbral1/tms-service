import { servicesConfig } from '../../config/services.config.js';
import { BaseHttpClient, requestJson } from './base-http.client.js';

export async function getPackageById(packageId) {
  return requestJson(`${servicesConfig.packingServiceUrl}/packages/${packageId}`);
}

export async function markPackagesDispatched(payload) {
  return requestJson(`${servicesConfig.packingServiceUrl}/packages/dispatched`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export class PackingClient extends BaseHttpClient {
  constructor(baseUrl = servicesConfig.packingServiceUrl) {
    super(baseUrl);
  }
}
