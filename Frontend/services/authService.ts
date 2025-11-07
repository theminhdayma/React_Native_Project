import { apiClient } from './api';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '@/types';

// Re-export types for backward compatibility
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
};

class AuthService {
  private api = apiClient.instance;

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Registering with data:', { ...data, password: '***' });
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      console.log('Register response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Register API error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Login request:', { ...data, password: '***' });
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      console.log('Login response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Login API error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    const response = await this.api.post<ApiResponse<string>>('/auth/forgot-password', data);
    return response.data.data;
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<string> {
    const response = await this.api.post<ApiResponse<string>>('/auth/verify-otp', data);
    return response.data.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<string> {
    const response = await this.api.post<ApiResponse<string>>('/auth/reset-password', data);
    return response.data.data;
  }

  async verifyEmail(email: string, otp: string): Promise<string> {
    const response = await this.api.post<ApiResponse<string>>('/auth/verify-otp', {
      email,
      otp,
      purpose: 'REGISTER',
    });
    return response.data.data;
  }
}

export const authService = new AuthService();

