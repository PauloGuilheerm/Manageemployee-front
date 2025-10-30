import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'token'

export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export type DecodedToken = {
    sub?: string
    email?: string
    role?: 'Director' | 'Leader' | 'Employee' | string
    exp?: number
    iss?: string
    aud?: string
}

export function decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null
    try {
        return jwtDecode(token)
    } catch {
        return null
    }
}

export function isTokenExpired(token: string | null): boolean {
    const decoded = decodeToken(token)
    if (!decoded?.exp) return false
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
}


