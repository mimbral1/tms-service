import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function sendNotification(payload) {
  return requestJson(`${servicesConfig.notificationServiceUrl}/notifications`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const notificationClient = {
  sendNotification,
};
