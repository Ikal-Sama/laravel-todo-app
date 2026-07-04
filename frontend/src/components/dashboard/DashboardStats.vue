<script setup lang="ts">
import { CheckCircle2, ListTodo, Timer } from '@lucide/vue'

defineProps<{
  totalCount: number
  completedCount: number
  notCompletedCount: number
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <div class="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07]">
      <ListTodo class="h-5 w-5 text-sky-300" />
      <p class="mt-4 text-3xl font-semibold tracking-tight">{{ totalCount }}</p>
      <p class="mt-1 text-sm text-white/60">Total tasks</p>
      <p class="mt-1 text-xs text-white/40">All todos in your list.</p>
    </div>

    <div class="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.06]">
      <CheckCircle2 class="h-5 w-5 text-emerald-300" />
      <p class="mt-4 text-3xl font-semibold tracking-tight">{{ completedCount }}</p>
      <p class="mt-1 text-sm text-white/60">Completed</p>
      <p class="mt-1 text-xs text-white/40">Tasks marked as done.</p>
    </div>

    <div class="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/20 hover:bg-amber-400/[0.06]">
      <Timer class="h-5 w-5 text-amber-300" />
      <p class="mt-4 text-3xl font-semibold tracking-tight">{{ notCompletedCount }}</p>
      <p class="mt-1 text-sm text-white/60">Not yet done</p>
      <p class="mt-1 text-xs text-white/40">Tasks that still need attention.</p>
    </div>
  </div>
</template>
