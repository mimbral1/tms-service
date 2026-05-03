import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function generateDeliverySheet(payload) {
  return requestJson(`${servicesConfig.documentServiceUrl}/documents/delivery-sheet`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function generateRouteManifest(payload) {
  return requestJson(`${servicesConfig.documentServiceUrl}/documents/route-manifest`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const documentClient = {
  generateDeliverySheet,
  generateRouteManifest,
};
