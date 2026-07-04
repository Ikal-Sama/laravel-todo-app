<script setup lang="ts">
import { Check, Loader2, PencilLine, Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { Todo } from '@/services/todos'

defineProps<{
  todos: Todo[]
  isLoading: boolean
  error: string | null
  currentPage: number
  lastPage: number
  totalCount: number
  completionBusyId: number | null
  deletingId: number | null
  paginationPages: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'page', page: number): void
}>()
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold tracking-tight">Todos</h2>
        <p class="text-sm text-white/50">Showing {{ todos.length }} of {{ totalCount }} todos.</p>
      </div>
    </div>

    <div class="space-y-3">
      <div v-if="isLoading" class="flex items-center justify-center py-12 text-white/50">
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Loading todos...
      </div>

      <div v-else-if="error" class="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
        {{ error }}
      </div>

      <div v-else-if="!todos.length" class="rounded-xl border border-dashed border-white/10 py-14 text-center text-sm text-white/40">
        No todos yet. Add one above to get started.
      </div>

      <div v-else class="grid gap-2">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="group flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05]"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex items-center gap-2.5">
              <span class="inline-flex h-2.5 w-2.5 shrink-0 rounded-full" :class="todo.is_completed ? 'bg-emerald-400' : 'bg-amber-400'" />
              <p class="truncate text-base font-medium" :class="todo.is_completed ? 'text-white/40 line-through' : 'text-white/90'">
                {{ todo.text }}
              </p>
            </div>
            <p class="pl-5 text-xs text-white/35">
              Created {{ todo.created_at }} · Updated {{ todo.updated_at }}
            </p>
          </div>

          <div class="flex shrink-0 gap-1.5">
            <div
              v-if="todo.is_completed"
              class="inline-flex h-8 items-center rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 text-xs font-medium text-emerald-300"
            >
              Completed
            </div>
            <Button
              v-else
              size="icon"
              variant="outline"
              class="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-emerald-300"
              :disabled="completionBusyId === todo.id"
              aria-label="Mark todo as done"
              @click="emit('toggle', todo.id)"
            >
              <Loader2 v-if="completionBusyId === todo.id" class="h-4 w-4 animate-spin" />
              <Check v-else class="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              class="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-cyan-300"
              aria-label="Edit todo"
              @click="emit('edit', todo.id)"
            >
              <PencilLine class="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              class="border-white/10 bg-white/5 text-white/70 hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
              :disabled="deletingId === todo.id"
              aria-label="Delete todo"
              @click="emit('delete', todo.id)"
            >
              <Loader2 v-if="deletingId === todo.id" class="h-4 w-4 animate-spin" />
              <Trash2 v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lastPage > 1" class="mt-6 flex flex-col items-start gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-white/50">Page {{ currentPage }} of {{ lastPage }}</p>
      <div class="flex flex-wrap gap-2">
        <Button
          variant="outline"
          class="border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          :disabled="currentPage === 1"
          @click="emit('page', currentPage - 1)"
        >
          Previous
        </Button>
        <Button
          v-for="page in paginationPages"
          :key="page"
          :variant="page === currentPage ? 'default' : 'outline'"
          :class="page === currentPage ? 'bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/30 border-0' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'"
          :disabled="page === currentPage"
          @click="emit('page', page)"
        >
          {{ page }}
        </Button>
        <Button
          variant="outline"
          class="border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          :disabled="currentPage === lastPage"
          @click="emit('page', currentPage + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
