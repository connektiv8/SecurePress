/**
 * Authentication service
 * 
 * Handles user authentication, token management, and user session.
 */

import api from './api'
import { User, LoginCredentials, RegisterData, AuthTokens } from '@/types'

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await api.post('/auth/login/', credentials)
  const { user, tokens } = response.data
  
  // Store tokens
  localStorage.setItem('access_token', tokens.access)
  localStorage.setItem('refresh_token', tokens.refresh)
  
  // Store user data
  localStorage.setItem('user', JSON.stringify(user))
  
  return { user, tokens }
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await api.post('/auth/register/', data)
  const { user, tokens } = response.data
  
  // Store tokens
  localStorage.setItem('access_token', tokens.access)
  localStorage.setItem('refresh_token', tokens.refresh)
  
  // Store user data
  localStorage.setItem('user', JSON.stringify(user))
  
  return { user, tokens }
}

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      await api.post('/auth/logout/', { refresh: refreshToken })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }
}

/**
 * Get current user from API
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me/')
  const user = response.data
  
  // Update stored user data
  localStorage.setItem('user', JSON.stringify(user))
  
  return user
}

/**
 * Get current user from local storage
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token')
}

/**
 * Change user password
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.post('/auth/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPassword,
  })
}

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch('/users/update_profile/', data)
  const user = response.data
  
  // Update stored user data
  localStorage.setItem('user', JSON.stringify(user))
  
  return user
}
