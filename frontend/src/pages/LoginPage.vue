<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/lib/api'
import { login as loginRequest } from '@/services/auth'
import { loginSchema } from '@/lib/validation/schemas'
import { applyZodToErrors } from '@/lib/validation/useZodErrors'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
})

const errors = ref<{ email?: string; password?: string; general?: string }>({})
const submitting = ref(false)

function validate(): boolean {
  // Reset general; applyZodToErrors clears and repopulates field keys.
  errors.value = { ...errors.value, general: undefined }
  return applyZodToErrors(loginSchema, form, errors)
}

async function onSubmit() {
  if (!validate()) return

  submitting.value = true
  errors.value.general = undefined

  try {
    const response = await loginRequest({
      email: form.email,
      password: form.password,
    })

    auth.setToken(response.token)
    auth.setUser(response.user)

    const redirect = (route.query.redirect as string) || '/dashboard'
    await router.push(redirect)
  } catch (err) {
    if (err instanceof ApiError) {
      const fieldEmail = err.fieldError('email')
      const fieldPassword = err.fieldError('password')
      if (fieldEmail) errors.value.email = fieldEmail
      if (fieldPassword) errors.value.password = fieldPassword
      if (!fieldEmail && !fieldPassword) {
        errors.value.general = err.message || 'Invalid email or password. Please try again.'
      }
    } else {
      errors.value.general = 'Unable to reach the server. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-6">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>

      <form novalidate @submit.prevent="onSubmit">
        <CardContent class="space-y-4">
          <div v-if="errors.general" class="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ errors.general }}
          </div>

          <div class="space-y-1.5">
            <label for="email" class="text-sm font-medium">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password" class="text-sm font-medium">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :class="{ 'border-destructive': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
          <Button type="submit" class="w-full mt-5" :disabled="submitting">
            {{ submitting ? 'Signing in…' : 'Sign in' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            <RouterLink to="/register" class="font-medium text-foreground underline-offset-4 hover:underline">
              Create one
            </RouterLink>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
