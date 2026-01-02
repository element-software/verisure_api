export interface SecuritasCredentials {
  username: string;
  password: string;
}

export interface SessionData {
  customerId: string;
  sessionId: string;
  sessionExpires: Date;
  authenticated: boolean;
}

export interface AuthenticationResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  customerId?: string;
}

export interface AlarmStatus {
  armState: string;
  lastActivityTime: string;
  lastActivityType: string;
  status: string;
  events?: AlarmEvent[];
}

export interface AlarmEvent {
  eventTime: string;
  eventType: string;
  description: string;
}

export interface DeviceStatus {
  deviceId: string;
  name: string;
  type: string;
  status: string;
  lastUpdate: string;
}

export interface CommandResponse {
  success: boolean;
  message: string;
  commandId?: string;
  timestamp?: string;
}

export interface InstallationInfo {
  installationId: string;
  name: string;
  address: string;
  customerId: string;
  devices: DeviceStatus[];
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}
