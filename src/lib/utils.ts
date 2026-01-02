import { randomBytes } from 'crypto';

/**
 * Generate a UUID for device identification
 */
export function generateUUID(): string {
  return Array.from({ length: 16 }, () => '0').join('');
}

/**
 * Generate a device ID based on country and timestamp
 */
export function generateDeviceId(country: string): string {
  const timestamp = Date.now().toString();
  const random = randomBytes(8).toString('hex');
  return `${country}_${timestamp}_${random}`;
}

/**
 * Generate Indigitall device ID
 */
export function generateIndigitallId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Generate the unique ID for requests (used in login)
 */
export function generateRequestId(username: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `OWA_______________${username}_______________${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Get current timestamp in milliseconds
 */
export function getTimestamp(): number {
  return Date.now();
}
