/**
 * Core TypeScript type definitions for SecurePress
 */

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'admin' | 'editor' | 'author' | 'subscriber'
  bio?: string
  avatar?: string
  is_active: boolean
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}

export interface ApiError {
  detail?: string
  [key: string]: any
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
