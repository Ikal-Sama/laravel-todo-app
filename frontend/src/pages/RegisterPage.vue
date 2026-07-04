<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ApiError } from '@/lib/api'
import { register as registerRequest } from '@/services/auth'
import { registerSchema } from '@/lib/validation/schemas'
import { applyZodToErrors } from '@/lib/validation/useZodErrors'
import { Button } from '@/components/ui/button'

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
  <div class="relative min-h-screen overflow-hidden bg-[#0b1020] text-white">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#0b1020_0%,_#111827_55%,_#0f172a_100%)]" />
    <div class="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

    <main class="relative flex min-h-screen items-center justify-center px-6">
      <div class="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/15">
        <div class="mb-8 space-y-1.5 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p class="text-sm text-white/60">Get started in less than a minute.</p>
        </div>

        <form novalidate @submit.prevent="onSubmit" class="space-y-5">
          <div v-if="errors.general" class="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
            {{ errors.general }}
          </div>

          <div class="space-y-1.5">
            <label for="name" class="text-sm font-medium text-white/80">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Jane Doe"
              class="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white shadow-sm outline-none transition-all duration-200 placeholder:text-white/35 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30"
              :class="{ 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/30': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-red-300">{{ errors.name }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="email" class="text-sm font-medium text-white/80">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white shadow-sm outline-none transition-all duration-200 placeholder:text-white/35 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30"
              :class="{ 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/30': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-red-300">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password" class="text-sm font-medium text-white/80">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              placeholder="At least 8 characters"
              class="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white shadow-sm outline-none transition-all duration-200 placeholder:text-white/35 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30"
              :class="{ 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/30': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-red-300">{{ errors.password }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="password_confirmation" class="text-sm font-medium text-white/80">Confirm password</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              placeholder="Repeat your password"
              class="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white shadow-sm outline-none transition-all duration-200 placeholder:text-white/35 focus:border-cyan-400/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30"
              :class="{ 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/30': errors.password_confirmation }"
            />
            <p v-if="errors.password_confirmation" class="text-xs text-red-300">
              {{ errors.password_confirmation }}
            </p>
          </div>

          <Button type="submit" class="w-full" size="lg" :disabled="submitting">
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </Button>

          <p class="text-center text-sm text-white/50">
            Already have an account?
            <RouterLink to="/login" class="font-medium text-cyan-300 underline-offset-4 transition-colors hover:text-cyan-200 hover:underline">
              Sign in
            </RouterLink>
          </p>
        </form>
      </div>
    </main>
  </div>
</template>
