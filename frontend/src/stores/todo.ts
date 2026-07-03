import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ApiError } from '@/lib/api'
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
  type PaginatedTodos,
  type Todo,
  type TodoInput,
  type UpdateTodoInput,
} from '@/services/todos'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const perPage = ref(10)
  const total = ref(0)
  const lastPage = ref(1)

  const completedCount = computed(() => todos.value.filter((todo) => todo.is_completed).length)
  const notCompletedCount = computed(
    () => todos.value.filter((todo) => !todo.is_completed).length,
  )

  async function fetchTodos(page = currentPage.value) {
    isLoading.value = true
    error.value = null

    try {
      const response: PaginatedTodos = await listTodos({
        page,
        per_page: perPage.value,
      })

      todos.value = response.data
      currentPage.value = response.meta?.current_page ? Number(response.meta.current_page) : page
      perPage.value = response.meta?.per_page ? Number(response.meta.per_page) : perPage.value
      total.value = response.meta?.total ? Number(response.meta.total) : response.data.length
      lastPage.value = response.meta?.last_page ? Number(response.meta.last_page) : 1
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Unable to load todos.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addTodo(payload: TodoInput) {
    isSubmitting.value = true
    error.value = null

    try {
      const todo = await createTodo(payload)
      todos.value = [todo, ...todos.value]
      total.value += 1
      return todo
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Unable to create todo.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function editTodo(id: number, payload: UpdateTodoInput) {
    isSubmitting.value = true
    error.value = null

    try {
      const updated = await updateTodo(id, payload)
      todos.value = todos.value.map((todo) => (todo.id === id ? updated : todo))
      return updated
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Unable to update todo.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function removeTodo(id: number) {
    isSubmitting.value = true
    error.value = null

    try {
      await deleteTodo(id)
      todos.value = todos.value.filter((todo) => todo.id !== id)
      total.value = Math.max(total.value - 1, 0)
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Unable to delete todo.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  async function toggleTodo(todo: Todo) {
    return editTodo(todo.id, { is_completed: !todo.is_completed })
  }

  return {
    todos,
    isLoading,
    isSubmitting,
    error,
    currentPage,
    perPage,
    total,
    lastPage,
    completedCount,
    notCompletedCount,
    fetchTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
  }
})
