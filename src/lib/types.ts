export interface SecuritasCredentials {
  username: string;
  password: string;
  country?: string;
}

export interface DeviceInfo {
  deviceId: string;
  uuid: string;
  idDeviceIndigitall: string;
  deviceBrand: string;
  deviceName: string;
  deviceOsVersion: string;
  deviceType: string;
  deviceVersion: string;
  deviceResolution: string;
}

export interface SessionData {
  hash: string;
  refreshToken: string;
  loginTimestamp: number;
  authenticated: boolean;
}

export interface GraphQLRequest {
  operationName: string;
  variables: Record<string, any>;
  query: string;
}

export interface LoginTokenResponse {
  data: {
    xSLoginToken: {
      __typename: string;
      res: string;
      msg: string;
      hash: string;
      refreshToken: string;
      legals: string;
      changePassword: boolean;
      needDeviceAuthorization: boolean;
      mainUser: string;
    };
  };
}

export interface AuthenticationResponse {
  success: boolean;
  message: string;
  hash?: string;
  refreshToken?: string;
}

export interface AlarmStatus {
  status: string;
  timestampUpdate: string;
  exceptions?: Array<{
    status: string;
    deviceType: string;
    alias: string;
  }>;
}

export interface Installation {
  numinst: string;
  alias: string;
  panel: string;
  type: string;
  name: string;
  surname: string;
  address: string;
  city: string;
  postcode: string;
  province: string;
  email: string;
  phone: string;
}

export interface InstallationListResponse {
  data: {
    xSInstallations: {
      installations: Installation[];
    };
  };
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
  referenceId?: string;
  timestamp?: string;
}

export interface ArmDisarmResponse {
  data: {
    xSArmPanel?: {
      res: string;
      msg: string;
      referenceId: string;
    };
    xSDisarmPanel?: {
      res: string;
      msg: string;
      referenceId: string;
    };
  };
}

export interface StatusResponse {
  data: {
    xSStatus: {
      status: string;
      timestampUpdate: string;
      exceptions: Array<{
        status: string;
        deviceType: string;
        alias: string;
      }>;
    };
  };
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}
