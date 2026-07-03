import { request } from '@/lib/api'
import type { AuthUser } from '@/stores/auth'

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/api/login', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  })
}

export function register(payload: RegisterPayload): Promise<void> {
  return request<void>('/api/register', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  })
}

export function logout(): Promise<void> {
  return request<void>('/api/logout', {
    method: 'POST',
  })
}

export function fetchCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>('/api/user')
}
