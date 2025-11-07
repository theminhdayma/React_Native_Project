import axios, { AxiosInstance, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '@/config/apiConfig';
import type { ApiResponse } from '@/types';

// Get API base URL from config
const API_BASE_URL = getApiBaseUrl();

// Log the API URL for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📱 Platform:', Platform.OS);
console.log('🔧 Environment:', __DEV__ ? 'Development' : 'Production');

// Re-export for convenience (maintains backward compatibility)
export type { ApiResponse };

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('@auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          if (__DEV__) {
            console.error('Error getting token:', error);
          }
        }
        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error('Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        // Success response
        return response;
      },
      async (error: AxiosError) => {
        // Handle network errors
        if (error.code === 'ECONNABORTED') {
          if (__DEV__) {
            console.error('Request timeout:', error.message);
          }
          error.message = 'Request timeout. Please check your connection and try again.';
        } else if (!error.response) {
          // Network error - backend not reachable
          if (__DEV__) {
            console.error('Network error - cannot reach backend:', API_BASE_URL);
          }
          error.message = `Cannot connect to server. Please ensure:\n1. Backend is running on port 8080\n2. If using physical device, update API_BASE_URL to your computer's IP address\n3. Check your network connection`;
        }
        
        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401) {
          try {
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@auth_user');
          } catch (storageError) {
            if (__DEV__) {
              console.error('Error clearing auth data:', storageError);
            }
          }
        }

        // Log errors in development (only for serious errors)
        if (__DEV__) {
          const status = error.response?.status;
          // Only log serious errors (500, 401, network errors)
          // Don't log: 400 (validation), 409 (conflict)
          if (!status || status >= 500 || status === 401) {
            console.error('❌ API Error:', error.message);
            if (error.response) {
              console.error('Status:', error.response.status);
              console.error('Data:', error.response.data);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.api;
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.api.get('/health', { timeout: 5000 });
      if (__DEV__) {
        console.log('✅ Backend connection successful:', response.data);
      }
      return response.status === 200;
    } catch (error: any) {
      if (__DEV__) {
        console.error('❌ Backend connection test failed:', {
          message: error.message,
          code: error.code,
          url: API_BASE_URL + '/health',
        });
      }
      return false;
    }
  }
}

export const apiClient = new ApiClient();


