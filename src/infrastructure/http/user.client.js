import { servicesConfig } from '../../config/services.config.js';
import { requestJson } from './base-http.client.js';

export async function getUserById(userId) {
  return requestJson(`${servicesConfig.userServiceUrl}/users/${userId}`);
}

export async function getDriverByUserId(userId) {
  return requestJson(`${servicesConfig.userServiceUrl}/drivers/by-user/${userId}`);
}

export const userClient = {
  getUserById,
  getDriverByUserId,
};
