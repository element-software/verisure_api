export const API_BASE_URL = 'https://customers.verisure.co.uk/owa-api/graphql';
export const API_TIMEOUT = 30000;

// GraphQL Operations
export const GRAPHQL_OPERATIONS = {
  LOGIN: {
    operationName: 'mkLoginToken',
    query: `mutation mkLoginToken($user: String!, $password: String!, $id: String!, $country: String!, $lang: String!, $callby: String!, $idDevice: String!, $idDeviceIndigitall: String!, $deviceType: String!, $deviceVersion: String!, $deviceResolution: String!, $deviceName: String!, $deviceBrand: String!, $deviceOsVersion: String!, $uuid: String!) {
      xSLoginToken(user: $user, password: $password, country: $country, lang: $lang, callby: $callby, id: $id, idDevice: $idDevice, idDeviceIndigitall: $idDeviceIndigitall, deviceType: $deviceType, deviceVersion: $deviceVersion, deviceResolution: $deviceResolution, deviceName: $deviceName, deviceBrand: $deviceBrand, deviceOsVersion: $deviceOsVersion, uuid: $uuid) {
        __typename
        res
        msg
        hash
        refreshToken
        legals
        changePassword
        needDeviceAuthorization
        mainUser
      }
    }`,
  },
  LIST_INSTALLATIONS: {
    operationName: 'mkInstallationList',
    query: `query mkInstallationList {
      xSInstallations {
        installations {
          numinst
          alias
          panel
          type
          name
          surname
          address
          city
          postcode
          province
          email
          phone
        }
      }
    }`,
  },
  STATUS: {
    operationName: 'Status',
    query: `query Status($numinst: String!) {
      xSStatus(numinst: $numinst) {
        status
        timestampUpdate
        exceptions {
          status
          deviceType
          alias
        }
      }
    }`,
  },
  ARM_PANEL: {
    operationName: 'xSArmPanel',
    query: `mutation xSArmPanel($numinst: String!, $request: ArmCodeRequest!, $panel: String!, $currentStatus: String) {
      xSArmPanel(numinst: $numinst, request: $request, panel: $panel, currentStatus: $currentStatus) {
        res
        msg
        referenceId
      }
    }`,
  },
  DISARM_PANEL: {
    operationName: 'xSDisarmPanel',
    query: `mutation xSDisarmPanel($numinst: String!, $request: DisarmCodeRequest!, $panel: String!) {
      xSDisarmPanel(numinst: $numinst, request: $request, panel: $panel) {
        res
        msg
        referenceId
      }
    }`,
  },
};

// Device configuration
export const DEVICE_CONFIG = {
  BRAND: 'generic',
  NAME: 'PostmanTestClient',
  OS_VERSION: '12',
  TYPE: '',
  VERSION: '10.102.0',
  RESOLUTION: '',
  CALLBY: 'OWA_10',
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
