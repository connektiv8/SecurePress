/**
 * Centralized API Service
 * 
 * Provides a single, secure interface for all API calls.
 * Handles authentication, error handling, and request/response transformation.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')

// Error response interface
interface ApiErrorResponse {
  detail?: string
  [key: string]: any
}

// API call options
interface ApiCallOptions extends AxiosRequestConfig {
  requiresAuth?: boolean
}

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Knox uses token header, not cookies
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add token if available
        const token = sessionStorage.getItem('auth_token')
        if (token && config.headers) {
          config.headers.Authorization = `Token ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          // Clear auth state and redirect to login
          sessionStorage.removeItem('auth_token')
          sessionStorage.removeItem('user')
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }

        // Format error message
        const errorMessage = error.response?.data?.detail || error.message || 'An error occurred'
        
        return Promise.reject({
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        })
      }
    )
  }

  /**
   * Centralized API call method
   * All API requests should go through this method for consistency and security
   */
  async apiCall<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    options: ApiCallOptions = {}
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: endpoint,
        ...options,
      }

      // Add data based on method
      if (method === 'GET') {
        config.params = data
      } else {
        config.data = data
      }

      const response: AxiosResponse<T> = await this.client.request(config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, params?: any, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('GET', endpoint, params, options)
  }

  async post<T = any>(endpoint: string, data?: any, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('POST', endpoint, data, options)
  }

  async put<T = any>(endpoint: string, data?: any, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('PUT', endpoint, data, options)
  }

  async patch<T = any>(endpoint: string, data?: any, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('PATCH', endpoint, data, options)
  }

  async delete<T = any>(endpoint: string, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('DELETE', endpoint, undefined, options)
  }

  /**
   * Upload file with proper content type
   */
  async uploadFile<T = any>(endpoint: string, formData: FormData, options?: ApiCallOptions): Promise<T> {
    return this.apiCall<T>('POST', endpoint, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export the centralized apiCall function for use throughout the app
export const apiCall = apiService.apiCall.bind(apiService)

// Export convenience methods
export const api = {
  get: apiService.get.bind(apiService),
  post: apiService.post.bind(apiService),
  put: apiService.put.bind(apiService),
  patch: apiService.patch.bind(apiService),
  delete: apiService.delete.bind(apiService),
  uploadFile: apiService.uploadFile.bind(apiService),
  apiCall: apiService.apiCall.bind(apiService),
}

export default api
