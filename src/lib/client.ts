import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SecuritasCredentials,
  SessionData,
  AuthenticationResponse,
  AlarmStatus,
  CommandResponse,
  Installation,
  ApiError,
  DeviceInfo,
  GraphQLRequest,
  LoginTokenResponse,
  InstallationListResponse,
  StatusResponse,
  ArmDisarmResponse,
} from './types';
import { API_BASE_URL, API_TIMEOUT, GRAPHQL_OPERATIONS, DEVICE_CONFIG } from './constants';
import {
  generateUUID,
  generateDeviceId,
  generateIndigitallId,
  generateRequestId,
  getTimestamp,
} from './utils';

export class SecuritasDirectClient {
  private client: AxiosInstance;
  private session: SessionData | null = null;
  private credentials: SecuritasCredentials | null = null;
  private deviceInfo: DeviceInfo;
  private country: string;

  constructor(country: string = 'GB') {
    this.country = country;
    
    // Initialize device info
    this.deviceInfo = {
      deviceId: generateDeviceId(country),
      uuid: generateUUID(),
      idDeviceIndigitall: generateIndigitallId(),
      deviceBrand: DEVICE_CONFIG.BRAND,
      deviceName: DEVICE_CONFIG.NAME,
      deviceOsVersion: DEVICE_CONFIG.OS_VERSION,
      deviceType: DEVICE_CONFIG.TYPE,
      deviceVersion: DEVICE_CONFIG.VERSION,
      deviceResolution: DEVICE_CONFIG.RESOLUTION,
    };

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Execute a GraphQL request
   */
  private async executeGraphQL<T = any>(
    operationName: string,
    query: string,
    variables: Record<string, any> = {}
  ): Promise<T> {
    const payload: GraphQLRequest = {
      operationName,
      variables,
      query,
    };

    const headers: Record<string, string> = {
      'X-APOLLO-OPERATION-NAME': operationName,
    };

    // Add authentication headers if we have a session
    if (this.session) {
      const authHeader = {
        loginTimestamp: this.session.loginTimestamp,
        user: this.credentials?.username || '',
        id: generateRequestId(this.credentials?.username || ''),
        country: this.country,
        lang: 'en',
        callby: DEVICE_CONFIG.CALLBY,
        hash: this.session.hash,
      };
      headers['auth'] = JSON.stringify(authHeader);
    }

    const response = await this.client.post<T>('', payload, { headers });
    return response.data;
  }

  /**
   * Authenticate with Securitas Direct API using GraphQL
   */
  async authenticate(credentials: SecuritasCredentials): Promise<AuthenticationResponse> {
    try {
      this.credentials = credentials;
      this.country = credentials.country || this.country;

      const variables = {
        user: credentials.username,
        password: credentials.password,
        id: generateRequestId(credentials.username),
        country: this.country,
        lang: 'en',
        callby: DEVICE_CONFIG.CALLBY,
        idDevice: this.deviceInfo.deviceId,
        idDeviceIndigitall: this.deviceInfo.idDeviceIndigitall,
        deviceType: this.deviceInfo.deviceType,
        deviceVersion: this.deviceInfo.deviceVersion,
        deviceResolution: this.deviceInfo.deviceResolution,
        deviceName: this.deviceInfo.deviceName,
        deviceBrand: this.deviceInfo.deviceBrand,
        deviceOsVersion: this.deviceInfo.deviceOsVersion,
        uuid: this.deviceInfo.uuid,
      };

      const response = await this.executeGraphQL<LoginTokenResponse>(
        GRAPHQL_OPERATIONS.LOGIN.operationName,
        GRAPHQL_OPERATIONS.LOGIN.query,
        variables
      );

      // Check if we have a valid response structure
      if (!response || !response.data || !response.data.xSLoginToken) {
        console.error('Invalid response structure:', JSON.stringify(response, null, 2));
        return {
          success: false,
          message: 'Invalid response from server. Response: ' + JSON.stringify(response),
        };
      }

      const loginData = response.data.xSLoginToken;

      // Check if login was successful
      if (loginData.res !== 'OK' && !loginData.hash) {
        return {
          success: false,
          message: loginData.msg || 'Authentication failed',
        };
      }

      // Create session data
      this.session = {
        hash: loginData.hash,
        refreshToken: loginData.refreshToken,
        loginTimestamp: getTimestamp(),
        authenticated: true,
      };

      return {
        success: true,
        message: loginData.msg || 'Authentication successful',
        hash: loginData.hash,
        refreshToken: loginData.refreshToken,
      };
    } catch (error: any) {
      console.error('Authentication error:', error);
      console.error('Error response:', error.response?.data);
      return {
        success: false,
        message: this.getErrorMessage(error),
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.session?.authenticated ?? false;
  }

  /**
   * Get current session data
   */
  getSession(): SessionData | null {
    return this.session;
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.session = null;
    this.credentials = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Get installation information
   */
  async getInstallations(): Promise<Installation[]> {
    this.checkAuthentication();
    try {
      const response = await this.executeGraphQL<InstallationListResponse>(
        GRAPHQL_OPERATIONS.LIST_INSTALLATIONS.operationName,
        GRAPHQL_OPERATIONS.LIST_INSTALLATIONS.query
      );
      return response.data.xSInstallations.installations;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get alarm status for an installation
   */
  async getStatus(installationNumber: string): Promise<AlarmStatus> {
    this.checkAuthentication();
    try {
      const response = await this.executeGraphQL<StatusResponse>(
        GRAPHQL_OPERATIONS.STATUS.operationName,
        GRAPHQL_OPERATIONS.STATUS.query,
        { numinst: installationNumber }
      );
      return response.data.xSStatus;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Arm the alarm system
   */
  async arm(
    installationNumber: string,
    panel: string,
    armMode: string = 'ARM1',
    currentStatus: string = ''
  ): Promise<CommandResponse> {
    this.checkAuthentication();
    try {
      const response = await this.executeGraphQL<ArmDisarmResponse>(
        GRAPHQL_OPERATIONS.ARM_PANEL.operationName,
        GRAPHQL_OPERATIONS.ARM_PANEL.query,
        {
          numinst: installationNumber,
          request: armMode,
          panel: panel,
          currentStatus: currentStatus,
        }
      );

      const armData = response.data.xSArmPanel;
      return {
        success: armData?.res === 'OK',
        message: armData?.msg || '',
        referenceId: armData?.referenceId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Disarm the alarm system
   */
  async disarm(
    installationNumber: string,
    panel: string,
    disarmMode: string = 'DARM1'
  ): Promise<CommandResponse> {
    this.checkAuthentication();
    try {
      const response = await this.executeGraphQL<ArmDisarmResponse>(
        GRAPHQL_OPERATIONS.DISARM_PANEL.operationName,
        GRAPHQL_OPERATIONS.DISARM_PANEL.query,
        {
          numinst: installationNumber,
          request: disarmMode,
          panel: panel,
        }
      );

      const disarmData = response.data.xSDisarmPanel;
      return {
        success: disarmData?.res === 'OK',
        message: disarmData?.msg || '',
        referenceId: disarmData?.referenceId,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh session if it's about to expire
   */
  async refreshSession(): Promise<boolean> {
    if (!this.credentials) {
      return false;
    }

    try {
      const result = await this.authenticate(this.credentials);
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Check if authenticated, throw error if not
   */
  private checkAuthentication(): void {
    if (!this.isAuthenticated()) {
      const error: ApiError = {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated. Please authenticate first.',
        statusCode: 401,
      };
      throw error;
    }
  }

  /**
   * Handle errors and convert to ApiError
   */
  private handleError(error: any): ApiError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Check for GraphQL errors
      if (data.errors && Array.isArray(data.errors)) {
        const graphqlError = data.errors[0];
        const apiError: ApiError = {
          code: graphqlError.extensions?.code || 'GRAPHQL_ERROR',
          message: graphqlError.message || 'GraphQL error occurred',
          statusCode: status,
        };
        throw apiError;
      }

      let code: string = 'SERVER_ERROR';
      if (status === 401) {
        code = 'INVALID_CREDENTIALS';
      } else if (status === 404) {
        code = 'NOT_FOUND';
      } else if (status === 400) {
        code = 'INVALID_REQUEST';
      }

      const apiError: ApiError = {
        code,
        message: data.message || error.message || 'Unknown error',
        statusCode: status,
      };
      throw apiError;
    } else if (error.code === 'ECONNABORTED') {
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Request timeout',
        statusCode: 0,
      };
      throw apiError;
    } else if (error.message) {
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: error.message,
        statusCode: 0,
      };
      throw apiError;
    }

    throw error;
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    // Check for GraphQL errors
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors[0].message || 'GraphQL error occurred';
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.status === 401) {
      return 'Invalid credentials';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Connection timeout';
    }
    return error.message || 'Unknown error occurred';
  }
}
