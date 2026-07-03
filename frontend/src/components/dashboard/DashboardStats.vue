<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  totalCount: number
  completedCount: number
  notCompletedCount: number
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <Card>
      <CardHeader>
        <CardDescription>Total tasks</CardDescription>
        <CardTitle class="text-3xl">{{ totalCount }}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">All todos in your list.</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardDescription>Completed</CardDescription>
        <CardTitle class="text-3xl">{{ completedCount }}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">Tasks marked as done.</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardDescription>Not yet done</CardDescription>
        <CardTitle class="text-3xl">{{ notCompletedCount }}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">Tasks that still need attention.</p>
      </CardContent>
    </Card>
  </div>
</template>
