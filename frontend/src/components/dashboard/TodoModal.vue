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
    <AlertDialogContent class="border-white/10 bg-[#0b1020]/95 text-white shadow-2xl backdrop-blur-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle class="text-white">{{ isEditing ? 'Edit todo' : 'Create todo' }}</AlertDialogTitle>
        <AlertDialogDescription class="text-white/60">
          {{ isEditing ? 'Update the selected task and save it back to the list.' : 'Add a new task to your todo board.' }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form class="space-y-4" @submit.prevent="emit('submit')">
        <Input
          :model-value="modelValue"
          placeholder="What needs to be done?"
          class="border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-cyan-400/50 focus:ring-cyan-400/30"
          @update:model-value="emit('update:modelValue', String($event))"
        />
        <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
        <p v-else-if="editingText" class="text-sm text-white/50">
          Editing: <span class="font-medium text-white/90">{{ editingText }}</span>
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel class="border-white/10 bg-white/5 text-white/70 hover:bg-white/10">Cancel</AlertDialogCancel>
          <Button type="submit" :disabled="isSubmitting" class="bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 border-0">
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
