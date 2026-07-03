import { useAuthHeaderStore } from '@/stores/authHeader'

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL as string | undefined

if (!BASE_URL) {
  throw new Error(
    'VITE_BACKEND_API_URL is not defined. Add it to your frontend .env file.',
  )
}

export type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  public readonly status: number
  public readonly errors: Record<string, string[]>

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  /**
   * Returns the first validation error message for a given field, or undefined.
   */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0]
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  /**
   * When true, do not attach the Authorization header. Use for login/register.
   */
  skipAuth?: boolean
  signal?: AbortSignal
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, BASE_URL)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

function isEmptyBody(text: string): boolean {
  return text.length === 0
}

export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, skipAuth = false, signal } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (!skipAuth) {
    const authHeaderStore = useAuthHeaderStore()
    Object.assign(headers, authHeaderStore.getAuthHeader())
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  // 204 No Content — return undefined as T.
  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const payload: unknown = isEmptyBody(text) ? null : JSON.parse(text)

  if (!response.ok) {
    const errBody = (payload ?? {}) as ApiErrorBody
    const message =
      errBody.message ?? response.statusText ?? `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, errBody.errors ?? {})
  }

  return payload as T
}
