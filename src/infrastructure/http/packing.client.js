import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function getPackageById(packageId) {
  return requestJson(`${servicesConfig.packingServiceUrl}/packages/${packageId}`);
}

export async function getPackagesByShippingId(shippingId) {
  return requestJson(`${servicesConfig.packingServiceUrl}/packages?shippingId=${shippingId}`);
}

export async function markPackagesDispatched(payload) {
  return requestJson(`${servicesConfig.packingServiceUrl}/packages/dispatched`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const packingClient = {
  getPackageById,
  getPackagesByShippingId,
  markPackagesDispatched,
};
