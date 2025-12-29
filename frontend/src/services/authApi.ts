/**
 * Authentication API Service
 * 
 * Handles all authentication-related API calls using Knox tokens.
 * Uses the centralized API service for security and consistency.
 */

import { api } from './apiService'
import { User, LoginCredentials, RegisterData } from '@/types'

interface LoginResponse {
  user: User
  token: string
  expiry: string
}

interface RegisterResponse {
  user: User
  token: string
  expiry: string
}

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return api.post<LoginResponse>('/auth/login/', credentials)
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  return api.post<RegisterResponse>('/auth/register/', data)
}

/**
 * Logout current user (invalidates Knox token)
 */
export const logout = async (token: string): Promise<void> => {
  try {
    await api.post('/auth/logout/', {})
  } catch (error) {
    // Ignore logout errors (token might already be invalid)
    console.error('Logout error:', error)
  }
}

/**
 * Logout from all devices (invalidates all Knox tokens)
 */
export const logoutAll = async (): Promise<void> => {
  return api.post('/auth/logout-all/', {})
}

/**
 * Get current user from API
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  return api.get<User>('/users/me/')
}

/**
 * Change user password
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ detail: string; token: string; expiry: string }> => {
  return api.post('/auth/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPassword,
  })
}

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  return api.patch<User>('/users/update_profile/', data)
}
