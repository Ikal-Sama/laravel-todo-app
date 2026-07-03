<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CheckCircle2, ShieldCheck, Sparkles } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

const auth = useAuthStore()
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#0b1020] text-white">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#0b1020_0%,_#111827_55%,_#0f172a_100%)]" />
    <div class="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

    <main class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24">
      <div class="flex w-full max-w-5xl flex-col items-center gap-16 text-center lg:gap-20">
        <section class="space-y-10">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/80 backdrop-blur transition-transform duration-300 hover:scale-[1.02]">
            <Sparkles class="h-4 w-4 text-cyan-300" />
            Modern todo workflow with Laravel and Vue
          </div>

          <div class="space-y-6">
            <h1 class="mx-auto max-w-3xl text-6xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-[5.5rem] lg:leading-[1.02]">
              A sharper way to track what matters.
            </h1>
            <p class="mx-auto max-w-2xl text-xl leading-9 text-white/72">
              Build, organize, complete, and clear your tasks with a fast Laravel API and a polished Vue interface.
            </p>
          </div>

          <div class="flex flex-col items-center justify-center mt-5 gap-4 sm:flex-row">
            <template v-if="auth.isAuthenticated">
              <RouterLink to="/dashboard">
                <Button size="lg" class="w-full sm:w-auto">Go to dashboard</Button>
              </RouterLink>
              <Button size="lg" variant="outline" class="border-white/15 bg-white/5 text-white hover:bg-white/10" @click="auth.logout">
                Sign out
              </Button>
            </template>
            <template v-else>
              <RouterLink to="/register">
                <Button size="lg" class="w-full sm:w-auto">Create account</Button>
              </RouterLink>
              <RouterLink to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  class="border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </RouterLink>
            </template>
          </div>

          <div class="grid gap-4 pt-6 sm:grid-cols-3">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5  ">
              <CheckCircle2 class="h-5 w-5 text-emerald-300" />
              <p class="mt-4 text-base font-medium">Task completion</p>
              <p class="mt-2 text-sm leading-6 text-white/65">Mark todo items done with one tap.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 ">
              <ShieldCheck class="h-5 w-5 text-sky-300" />
              <p class="mt-4 text-base font-medium">Authenticated</p>
              <p class="mt-2 text-sm leading-6 text-white/65">Private lists per signed-in user.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 ">
              <Sparkles class="h-5 w-5 text-cyan-300" />
              <p class="mt-4 text-base font-medium">Modern UI</p>
              <p class="mt-2 text-sm leading-6 text-white/65">Clean cards, dialog flow, and pagination.</p>
            </div>
          </div>
        </section>

     
      </div>
    </main>
  </div>
</template>
