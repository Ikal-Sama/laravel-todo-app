import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export interface AuthHeader {
  Authorization: string
}

/**
 * Single source of truth for outgoing Authorization headers.
 *
 * Reads the token from the auth store so the auth store remains the only
 * place that mutates token state. Returns an empty object when unauthenticated
 * so the API client can simply spread it.
 */
export const useAuthHeaderStore = defineStore('authHeader', () => {
  function getAuthHeader(): AuthHeader | Record<string, never> {
    const auth = useAuthStore()
    const token = auth.token

    if (!token) {
      return {}
    }

    return { Authorization: `Bearer ${token}` }
  }

  return { getAuthHeader }
})
