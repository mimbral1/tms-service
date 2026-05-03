import { servicesConfig } from '../../config/services.config.js';
import { BaseHttpClient, requestJson } from './base-http.client.js';

export async function getOrderById(orderId) {
  return requestJson(`${servicesConfig.omsServiceUrl}/orders/${orderId}`);
}

export async function notifyOrderDeliveryStatus(orderId, payload) {
  return requestJson(
    `${servicesConfig.omsServiceUrl}/orders/${orderId}/delivery-status`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export class OmsClient extends BaseHttpClient {
  constructor(baseUrl = servicesConfig.omsServiceUrl) {
    super(baseUrl);
  }
}
