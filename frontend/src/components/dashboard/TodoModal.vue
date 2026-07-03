<script setup lang="ts">
import { computed } from 'vue'
import { Loader2, PencilLine, Plus } from '@lucide/vue'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  open: boolean
  editingText: string | null
  isSubmitting: boolean
  modelValue: string
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
  (e: 'close'): void
}>()

const isEditing = computed(() => props.editingText !== null)

function handleOpenChange(value: boolean) {
  if (!value) {
    emit('close')
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ isEditing ? 'Edit todo' : 'Create todo' }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ isEditing ? 'Update the selected task and save it back to the list.' : 'Add a new task to your todo board.' }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form class="space-y-4" @submit.prevent="emit('submit')">
        <Input
          :model-value="modelValue"
          placeholder="What needs to be done?"
          @update:model-value="emit('update:modelValue', String($event))"
        />
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <p v-else-if="editingText" class="text-sm text-muted-foreground">
          Editing: <span class="font-medium text-foreground">{{ editingText }}</span>
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
            <PencilLine v-else-if="isEditing" class="h-4 w-4" />
            <Plus v-else class="h-4 w-4" />
            {{ isEditing ? 'Update todo' : 'Add todo' }}
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
