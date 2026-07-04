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
  <header class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-white/15 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Todo board</p>
      <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p class="text-sm text-white/60">Welcome back, {{ userName }}.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <RouterLink to="/">
        <Button variant="outline" class="border-white/15 bg-white/5 text-white hover:bg-white/10">Home</Button>
      </RouterLink>
      <Button class="border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/20" @click="emit('logout')">Sign out</Button>
    </div>
  </header>
</template>
