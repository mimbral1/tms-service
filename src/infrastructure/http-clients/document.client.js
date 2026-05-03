import { servicesConfig } from '../../config/services.config.js';
import { BaseHttpClient, requestJson } from './base-http.client.js';

export async function generateDeliverySheet(payload) {
  return requestJson(`${servicesConfig.documentServiceUrl}/documents/delivery-sheet`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export class DocumentClient extends BaseHttpClient {
  constructor(baseUrl = servicesConfig.documentServiceUrl) {
    super(baseUrl);
  }
}
