import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address
const API_BASE_URL = __DEV__ 
  ? Platform.select({
      android: 'http://10.0.2.2:8080/api/v1',
      ios: 'http://localhost:8080/api/v1',
      default: 'http://localhost:8080/api/v1',
    })
  : 'http://your-api-url.com/api/v1';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  status: number;
  code: number;
  data: T;
  message: string;
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  }
}

export const authService = new AuthService();

