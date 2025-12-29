/**
 * Authentication Context
 * 
 * Centralized authentication state management with React Context API.
 * Provides secure token handling and user session management.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import * as authApi from '@/services/authApi'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from sessionStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = sessionStorage.getItem('auth_token')
        const storedUser = sessionStorage.getItem('user')
        
        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authApi.getCurrentUser(storedToken)
            setUser(currentUser)
            sessionStorage.setItem('user', JSON.stringify(currentUser))
          } catch (error) {
            // Token invalid, clear auth state
            handleLogout()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        handleLogout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login({ email, password })
      
      // Store in sessionStorage (more secure than localStorage, cleared on tab close)
      sessionStorage.setItem('auth_token', response.token)
      sessionStorage.setItem('user', JSON.stringify(response.user))
      
      setToken(response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      if (token) {
        await authApi.logout(token)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth state
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true)
    try {
      const response = await authApi.register({
        email,
        password,
        password_confirm: password,
        first_name: firstName,
        last_name: lastName,
      })
      
      // Store in sessionStorage
      sessionStorage.setItem('auth_token', response.token)
      sessionStorage.setItem('user', JSON.stringify(response.user))
      
      setToken(response.token)
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser)
    sessionStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUser: handleUpdateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
