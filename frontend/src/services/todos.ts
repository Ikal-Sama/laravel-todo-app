import { request } from '@/lib/api'
import type { TodoInput, UpdateTodoInput } from '@/lib/validation/schemas'

export interface Todo {
  id: number
  text: string
  is_completed: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface PaginatedTodos {
  data: Todo[]
  links?: Record<string, unknown>
  meta?: Record<string, unknown>
}

export type { TodoInput, UpdateTodoInput }

export type ListTodosParams = Record<string, string | number | boolean | undefined> & {
  page?: number
  per_page?: number
}

export function listTodos(params: ListTodosParams = {}): Promise<PaginatedTodos> {
  return request<PaginatedTodos>('/api/v1/todos', { query: params })
}

export function getTodo(id: number | string): Promise<Todo> {
  return request<Todo>(`/api/v1/todos/${id}`)
}

export function createTodo(payload: TodoInput): Promise<Todo> {
  return request<Todo>('/api/v1/todos', {
    method: 'POST',
    body: payload,
  })
}

export function updateTodo(
  id: number | string,
  payload: UpdateTodoInput,
): Promise<Todo> {
  return request<Todo>(`/api/v1/todos/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function completeTodo(id: number | string): Promise<Todo> {
  return request<Todo>(`/api/v1/todos/${id}/complete`, {
    method: 'PATCH',
  })
}

export function deleteTodo(id: number | string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/v1/todos/${id}`, {
    method: 'DELETE',
  })
}
