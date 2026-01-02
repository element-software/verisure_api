export const API_BASE_URL = 'https://api.securitasdirect.es/api';
export const API_TIMEOUT = 30000;

export const ENDPOINTS = {
  AUTH: '/login',
  INSTALLATIONS: '/installations',
  STATUS: '/status',
  ARM: '/arm',
  DISARM: '/disarm',
  DEVICES: '/devices',
  EVENTS: '/events',
};

export const ARM_STATES = {
  ARMED: 'armed',
  DISARMED: 'disarmed',
  ARMED_NIGHT: 'armed_night',
  ARMED_PARTIAL: 'armed_partial',
} as const;

export const DEVICE_TYPES = {
  DOOR: 'door',
  WINDOW: 'window',
  MOTION: 'motion',
  SMOKE: 'smoke',
  TEMPERATURE: 'temperature',
  KEYPAD: 'keypad',
  SIREN: 'siren',
} as const;

export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
} as const;
