<script setup lang="ts">
import { Check, Loader2, PencilLine, Trash2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
  <Card>
    <CardHeader>
      <CardTitle>Todos</CardTitle>
      <CardDescription>Showing {{ todos.length }} of {{ totalCount }} todos.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="isLoading" class="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Loading todos...
      </div>

      <div v-else-if="error" class="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {{ error }}
      </div>

      <div v-else-if="!todos.length" class="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
        No todos yet. Add one above to get started.
      </div>

      <div v-else class="grid gap-3">
        <Card
          v-for="todo in todos"
          :key="todo.id"
          class="border-muted/60 bg-muted/20 py-0 shadow-none transition-all"
        >
          <CardContent class="flex items-start justify-between gap-4 p-4">
            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2">
                <span class="inline-flex h-2.5 w-2.5 rounded-full" :class="todo.is_completed ? 'bg-emerald-500' : 'bg-amber-500'" />
                <p class="truncate text-base font-medium" :class="todo.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'">
                  {{ todo.text }}
                </p>
              </div>
              <p class="text-xs text-muted-foreground">
                Created {{ todo.created_at }} · Updated {{ todo.updated_at }}
              </p>
            </div>

            <div class="flex shrink-0 gap-2">
              <Button
                size="icon"
                variant="outline"
                :disabled="completionBusyId === todo.id"
                :aria-label="todo.is_completed ? 'Mark todo as not done' : 'Mark todo as done'"
                @click="emit('toggle', todo.id)"
              >
                <Loader2 v-if="completionBusyId === todo.id" class="h-4 w-4 animate-spin" />
                <Check v-else class="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Edit todo" @click="emit('edit', todo.id)">
                <PencilLine class="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                :disabled="deletingId === todo.id"
                aria-label="Delete todo"
                @click="emit('delete', todo.id)"
              >
                <Loader2 v-if="deletingId === todo.id" class="h-4 w-4 animate-spin" />
                <Trash2 v-else class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CardContent>

    <CardFooter class="flex flex-col items-start gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-muted-foreground">Page {{ currentPage }} of {{ lastPage }}</p>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" :disabled="currentPage === 1" @click="emit('page', currentPage - 1)">Previous</Button>
        <Button
          v-for="page in paginationPages"
          :key="page"
          :variant="page === currentPage ? 'default' : 'outline'"
          :disabled="page === currentPage"
          @click="emit('page', page)"
        >
          {{ page }}
        </Button>
        <Button variant="outline" :disabled="currentPage === lastPage" @click="emit('page', currentPage + 1)">Next</Button>
      </div>
    </CardFooter>
  </Card>
</template>
