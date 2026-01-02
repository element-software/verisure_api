import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SecuritasCredentials,
  SessionData,
  AuthenticationResponse,
  AlarmStatus,
  CommandResponse,
  InstallationInfo,
  ApiError,
} from './types';
import { API_BASE_URL, API_TIMEOUT, ENDPOINTS, ERROR_CODES } from './constants';

export class SecuritasDirectClient {
  private client: AxiosInstance;
  private session: SessionData | null = null;
  private credentials: SecuritasCredentials | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SecuritasDirectAPI/1.0.0',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Authenticate with Securitas Direct API
   */
  async authenticate(credentials: SecuritasCredentials): Promise<AuthenticationResponse> {
    try {
      this.credentials = credentials;
      const response = await this.client.post<any>(ENDPOINTS.AUTH, {
        username: credentials.username,
        password: credentials.password,
      });

      const data = response.data;

      // Create session data
      this.session = {
        customerId: data.customerId || data.userId || '',
        sessionId: data.sessionId || data.token || '',
        sessionExpires: new Date(Date.now() + 3600000), // 1 hour
        authenticated: true,
      };

      // Update client headers with session token
      if (this.session.sessionId) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.session.sessionId}`;
      }

      return {
        success: true,
        message: 'Authentication successful',
        sessionId: this.session.sessionId,
        customerId: this.session.customerId,
      };
    } catch (error) {
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
  async getInstallations(): Promise<InstallationInfo[]> {
    this.checkAuthentication();
    try {
      const response = await this.client.get<InstallationInfo[]>(ENDPOINTS.INSTALLATIONS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get alarm status for an installation
   */
  async getStatus(installationId: string): Promise<AlarmStatus> {
    this.checkAuthentication();
    try {
      const response = await this.client.get<AlarmStatus>(
        `${ENDPOINTS.STATUS}/${installationId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Arm the alarm system
   */
  async arm(installationId: string, armMode: string = 'armed'): Promise<CommandResponse> {
    this.checkAuthentication();
    try {
      const response = await this.client.post<CommandResponse>(
        `${ENDPOINTS.ARM}/${installationId}`,
        { armMode }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Disarm the alarm system
   */
  async disarm(installationId: string): Promise<CommandResponse> {
    this.checkAuthentication();
    try {
      const response = await this.client.post<CommandResponse>(
        `${ENDPOINTS.DISARM}/${installationId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get devices for an installation
   */
  async getDevices(installationId: string) {
    this.checkAuthentication();
    try {
      const response = await this.client.get(
        `${ENDPOINTS.DEVICES}/${installationId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get events/history for an installation
   */
  async getEvents(installationId: string, limit: number = 50): Promise<any[]> {
    this.checkAuthentication();
    try {
      const response = await this.client.get<any[]>(
        `${ENDPOINTS.EVENTS}/${installationId}`,
        { params: { limit } }
      );
      return response.data;
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
        code: ERROR_CODES.UNAUTHORIZED,
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

      let code: string = ERROR_CODES.SERVER_ERROR;
      if (status === 401) {
        code = ERROR_CODES.INVALID_CREDENTIALS;
      } else if (status === 404) {
        code = ERROR_CODES.NOT_FOUND;
      } else if (status === 400) {
        code = ERROR_CODES.INVALID_REQUEST;
      }

      const apiError: ApiError = {
        code,
        message: data.message || error.message || 'Unknown error',
        statusCode: status,
      };
      throw apiError;
    } else if (error.code === 'ECONNABORTED') {
      const apiError: ApiError = {
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Request timeout',
        statusCode: 0,
      };
      throw apiError;
    } else if (error.message) {
      const apiError: ApiError = {
        code: ERROR_CODES.NETWORK_ERROR,
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
