<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/lib/api'
import { register as registerRequest, login as loginRequest } from '@/services/auth'
import { registerSchema } from '@/lib/validation/schemas'
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

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = ref<{
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  general?: string
}>({})
const submitting = ref(false)

function validate(): boolean {
  errors.value = { ...errors.value, general: undefined }
  return applyZodToErrors(registerSchema, form, errors)
}

async function onSubmit() {
  if (!validate()) return

  submitting.value = true
  errors.value.general = undefined

  try {
    // Backend returns 204 with no token, so log in immediately after registering.
    await registerRequest({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })


    await router.push('/dashboard')
  } catch (err) {
    if (err instanceof ApiError) {
      const fieldName = err.fieldError('name')
      const fieldEmail = err.fieldError('email')
      const fieldPassword = err.fieldError('password')
      if (fieldName) errors.value.name = fieldName
      if (fieldEmail) errors.value.email = fieldEmail
      if (fieldPassword) errors.value.password = fieldPassword
      if (!fieldName && !fieldEmail && !fieldPassword) {
        errors.value.general = err.message || 'Could not create your account. Please try again.'
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
        <CardTitle class="text-2xl">Create your account</CardTitle>
        <CardDescription>Get started in less than a minute.</CardDescription>
      </CardHeader>

      <form novalidate @submit.prevent="onSubmit">
        <CardContent class="space-y-4">
          <div v-if="errors.general" class="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ errors.general }}
          </div>

          <div class="space-y-1.5">
            <label for="name" class="text-sm font-medium">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Jane Doe"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :class="{ 'border-destructive': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
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
              autocomplete="new-password"
              placeholder="At least 8 characters"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :class="{ 'border-destructive': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password_confirmation" class="text-sm font-medium">Confirm password</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat your password"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :class="{ 'border-destructive': errors.password_confirmation }"
            />
            <p v-if="errors.password_confirmation" class="text-xs text-destructive">
              {{ errors.password_confirmation }}
            </p>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
          <Button type="submit" class="w-full mt-5" :disabled="submitting">
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Already have an account?
            <RouterLink to="/login" class="font-medium text-foreground underline-offset-4 hover:underline">
              Sign in
            </RouterLink>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
