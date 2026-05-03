import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function getShippingById(shippingId) {
  return requestJson(`${servicesConfig.deliveryServiceUrl}/shipping/${shippingId}`);
}

export async function markShippingAssignedToRoute(shippingId, payload) {
  return requestJson(
    `${servicesConfig.deliveryServiceUrl}/shipping/${shippingId}/route-assigned`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function markShippingDelivered(shippingId, payload) {
  return requestJson(
    `${servicesConfig.deliveryServiceUrl}/shipping/${shippingId}/delivered`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function markShippingFailed(shippingId, payload) {
  return requestJson(
    `${servicesConfig.deliveryServiceUrl}/shipping/${shippingId}/failed`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export const deliveryClient = {
  getShippingById,
  markShippingAssignedToRoute,
  markShippingDelivered,
  markShippingFailed,
};
