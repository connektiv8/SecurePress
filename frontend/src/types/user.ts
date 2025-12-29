/**
 * User-related type definitions
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

export interface CreateUserData {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: 'admin' | 'editor' | 'author' | 'subscriber'
  bio?: string
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  password?: string
}
