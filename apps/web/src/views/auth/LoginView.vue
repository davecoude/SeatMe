<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn } from 'lucide-vue-next'
import gsap from 'gsap'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  gsap.from('.auth-image', { autoAlpha: 0, x: -30, duration: 0.8, ease: 'power3.out' })
  gsap.from('.auth-form', { autoAlpha: 0, x: 30, duration: 0.8, delay: 0.2, ease: 'power3.out' })
})

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Imagen decorativa -->
    <div class="auth-image hidden lg:block relative">
      <img
        src="/images/person.jpg"
        alt="Espacio de trabajo"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-primary-900/60" />
      <div class="absolute bottom-12 left-12 right-12">
        <h2 class="text-3xl font-bold text-white mb-3">Bienvenido</h2>
        <p class="text-white text-sm leading-relaxed">
          Tu escritorio favorito te espera. Inicia sesión y reserva en segundos.
        </p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="auth-form flex items-center justify-center px-6 py-12 bg-gray-50">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <RouterLink to="/" class="text-2xl font-bold text-primary-700">SeatMe</RouterLink>
          <h1 class="mt-6 text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p class="mt-2 text-sm text-gray-500">Ingresa tus credenciales para acceder</p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            @click="handleLogin"
            :disabled="loading || !email || !password"
            class="w-full py-2.5 px-4 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <AppSpinner v-if="loading" size="sm" />
            <template v-else>
              <LogIn class="w-4 h-4" />
              Iniciar sesión
            </template>
          </button>
        </div>

        <p class="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?
          <RouterLink to="/register" class="text-primary-700 font-medium hover:text-primary-800 transition-colors">
            Regístrate
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-image,
.auth-form {
  visibility: hidden;
}
</style>