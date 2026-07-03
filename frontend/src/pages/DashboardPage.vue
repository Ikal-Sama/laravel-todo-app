<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { ApiError } from '@/lib/api'
import { logout as logoutRequest } from '@/services/auth'
import { Button } from '@/components/ui/button'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
import TodoModal from '@/components/dashboard/TodoModal.vue'

const auth = useAuthStore()
const todoStore = useTodoStore()
const router = useRouter()

const userName = computed(() => auth.user?.name ?? auth.user?.email ?? 'there')
const todoText = ref('')
const isModalOpen = ref(false)
const editingTodoId = ref<number | null>(null)
const formError = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const completionBusyId = ref<number | null>(null)

const totalCount = computed(() => todoStore.total)
const completedCount = computed(() => todoStore.completedCount)
const notCompletedCount = computed(() => todoStore.notCompletedCount)
const editingTodo = computed(() =>
  editingTodoId.value === null
    ? null
    : todoStore.todos.find((todo) => todo.id === editingTodoId.value) ?? null,
)
const paginationPages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, todoStore.currentPage - 2)
  const end = Math.min(todoStore.lastPage, todoStore.currentPage + 2)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return pages
})

function openCreateModal() {
  editingTodoId.value = null
  todoText.value = ''
  formError.value = null
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingTodoId.value = null
  todoText.value = ''
  formError.value = null
}

async function loadTodos(page = todoStore.currentPage) {
  await todoStore.fetchTodos(page)
}

async function submitTodo() {
  const text = todoText.value.trim()
  if (!text) {
    formError.value = 'Task text is required.'
    return
  }

  formError.value = null

  try {
    if (editingTodoId.value === null) {
      await todoStore.addTodo({ text })
    } else {
      await todoStore.editTodo(editingTodoId.value, { text })
    }

    closeModal()
    await loadTodos(todoStore.currentPage)
  } catch (err) {
    formError.value = err instanceof ApiError ? err.fieldError('text') ?? err.message : 'Unable to save todo.'
  }
}

function editTodo(id: number) {
  const todo = todoStore.todos.find((item) => item.id === id)
  if (!todo) return

  editingTodoId.value = id
  todoText.value = todo.text
  formError.value = null
  isModalOpen.value = true
}

async function toggleTodo(id: number) {
  const todo = todoStore.todos.find((item) => item.id === id)
  if (!todo) return

  completionBusyId.value = id
  try {
    await todoStore.toggleTodo(todo)
    if (editingTodoId.value === id) closeModal()
  } finally {
    completionBusyId.value = null
  }
}

async function removeTodo(id: number) {
  deletingId.value = id
  try {
    await todoStore.removeTodo(id)
    if (editingTodoId.value === id) closeModal()
    await loadTodos(todoStore.currentPage)
  } finally {
    deletingId.value = null
  }
}

async function goToPage(page: number) {
  if (page < 1 || page > todoStore.lastPage || page === todoStore.currentPage) return
  await loadTodos(page)
}

async function onLogout() {
  try {
    await logoutRequest()
  } catch (err) {
    if (!(err instanceof ApiError)) {
      // eslint-disable-next-line no-console
      console.warn('Logout request failed:', err)
    }
  } finally {
    auth.logout()
    router.push('/login')
  }
}

onMounted(async () => {
  await loadTodos()
})

watch(editingTodo, (todo) => {
  if (editingTodoId.value !== null && !todo) closeModal()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <DashboardHeader :user-name="userName" @logout="onLogout" />

      <DashboardStats
        :total-count="totalCount"
        :completed-count="completedCount"
        :not-completed-count="notCompletedCount"
      />

      <div class="flex justify-end">
        <Button @click="openCreateModal">Create todo</Button>
      </div>

      <TodoModal
        :open="isModalOpen"
        :editing-text="editingTodo?.text ?? null"
        :is-submitting="todoStore.isSubmitting"
        v-model="todoText"
        :error="formError"
        @submit="submitTodo"
        @close="closeModal"
      />

      <TodoList
        :todos="todoStore.todos"
        :is-loading="todoStore.isLoading"
        :error="todoStore.error"
        :current-page="todoStore.currentPage"
        :last-page="todoStore.lastPage"
        :total-count="totalCount"
        :completion-busy-id="completionBusyId"
        :deleting-id="deletingId"
        :pagination-pages="paginationPages"
        @toggle="toggleTodo"
        @edit="editTodo"
        @delete="removeTodo"
        @page="goToPage"
      />
    </div>
  </div>
</template>
