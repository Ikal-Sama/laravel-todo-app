import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCurrentUser } from '@/services/auth'

export interface AuthUser {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<AuthUser | null>(loadUser())
  const isHydrated = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function loadUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user')
    if (!raw) return null

    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      localStorage.removeItem('auth_user')
      return null
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  function setUser(newUser: AuthUser | null) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('auth_user')
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  async function bootstrapUser() {
    if (!token.value) {
      isHydrated.value = true
      return
    }

    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch {
      logout()
    } finally {
      isHydrated.value = true
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isHydrated,
    setToken,
    setUser,
    logout,
    bootstrapUser,
  }
})
