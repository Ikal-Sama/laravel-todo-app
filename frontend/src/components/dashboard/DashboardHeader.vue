<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'

defineProps<{
  userName: string
}>()

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>

<template>
  <header class="flex flex-col gap-4 rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p class="text-sm uppercase tracking-[0.3em] text-muted-foreground">Todo board</p>
      <h1 class="text-3xl font-semibold">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Welcome back, {{ userName }}.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <RouterLink to="/">
        <Button variant="outline">Home</Button>
      </RouterLink>
      <Button variant="outline" @click="emit('logout')">Sign out</Button>
    </div>
  </header>
</template>
