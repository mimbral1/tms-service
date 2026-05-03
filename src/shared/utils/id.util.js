import { randomUUID } from 'node:crypto';

export function generateId() {
  return randomUUID();
}

export function generateDisplayId(prefix = 'TMS') {
  const date = new Date();

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${year}${month}${day}-${random}`;
}

export const createId = generateId;
