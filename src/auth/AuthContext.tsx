import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { clearToken, decodeToken, getToken, setToken as saveToken, type DecodedToken } from '../utils/token'
import { endpoints } from '../api/endpoints'

type AuthUser = {
  email: string
  role: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (docNumber: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken())
  const [user, setUser] = useState<AuthUser | null>(null)

  const syncUserFromToken = useCallback((t: string | null) => {
    const decoded: DecodedToken | null = decodeToken(t)
    if (decoded?.email && decoded?.role) {
      setUser({ email: decoded.email, role: decoded.role })
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    syncUserFromToken(token)
  }, [token, syncUserFromToken])

  useEffect(() => {
    const handler = () => {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('unauthorized', handler as EventListener)
    return () => window.removeEventListener('unauthorized', handler as EventListener)
  }, [])

  const login = useCallback(async (docNumber: string, password: string) => {
    const { data } = await endpoints.login({ docNumber, password })
    saveToken(data.token)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  }), [login, logout, token, user])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}


