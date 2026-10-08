<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserPlus } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import gsap from 'gsap'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const errors = ref<{ [key: string]: string }>({})
const loading = ref(false)

onMounted(() => {
  gsap.from('.auth-image', { autoAlpha: 0, x: 30, duration: 0.8, ease: 'power3.out' })
  gsap.from('.auth-form', { autoAlpha: 0, x: -30, duration: 0.8, delay: 0.2, ease: 'power3.out' })
})

function validate(): boolean {
  errors.value = {}

  if (!firstName.value.trim()) errors.value.firstName = 'Nombre requerido'
  if (!lastName.value.trim()) errors.value.lastName = 'Apellido requerido'
  if (!email.value.includes('@') || !email.value.includes('.')) errors.value.email = 'Email inválido'
  if (password.value.length < 8) {
    errors.value.password = 'Mínimo 8 caracteres'
  } else if (!/[A-Z]/.test(password.value)) {
    errors.value.password = 'Debe contener al menos una mayúscula'
  } else if (!/[0-9]/.test(password.value)) {
    errors.value.password = 'Debe contener al menos un número'
  }

  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return

  try {
    loading.value = true
    error.value = ''
    await auth.register(email.value, password.value, firstName.value, lastName.value)
    toast.success('Cuenta creada exitosamente')
    router.push('/login')
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Formulario -->
    <div class="auth-form flex items-center justify-center px-6 py-12 bg-gray-50 order-2 lg:order-1">
      <div class="w-full max-w-md">
        <div class="mb-8">
          <RouterLink to="/" class="text-2xl font-bold text-primary-700">SeatMe</RouterLink>
          <h1 class="mt-6 text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p class="mt-2 text-sm text-gray-500">Regístrate para empezar a reservar tu espacio</p>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
              <input
                v-model="firstName"
                type="text"
                :class="[
                  'w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                  errors.firstName ? 'border-red-400' : 'border-gray-300'
                ]"
                placeholder="John"
              />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
              <input
                v-model="lastName"
                type="text"
                :class="[
                  'w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                  errors.lastName ? 'border-red-400' : 'border-gray-300'
                ]"
                placeholder="Doe"
              />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              :class="[
                'w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                errors.email ? 'border-red-400' : 'border-gray-300'
              ]"
              placeholder="tu@email.com"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input
              v-model="password"
              type="password"
              :class="[
                'w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                errors.password ? 'border-red-400' : 'border-gray-300'
              ]"
              placeholder="••••••••"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
            <p v-else class="mt-1 text-xs text-gray-400">Mínimo 8 caracteres, una mayúscula y un número</p>
          </div>

          <button
            @click="handleRegister"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <AppSpinner v-if="loading" size="sm" />
            <template v-else>
              <UserPlus class="w-4 h-4" />
              Crear cuenta
            </template>
          </button>
        </div>

        <p class="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="text-primary-700 font-medium hover:text-primary-800 transition-colors">
            Inicia sesión
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Imagen decorativa -->
    <div class="auth-image hidden lg:block relative order-1 lg:order-2">
      <img
        src="/images/desk.jpg"
        alt="Escritorio minimalista"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-primary-900/60" />
      <div class="absolute bottom-12 left-12 right-12">
        <h2 class="text-3xl font-bold text-white mb-3">Únete a SeatMe</h2>
        <p class="text-white text-sm leading-relaxed">
          Crea tu cuenta en segundos y empieza a reservar tu espacio de trabajo ideal.
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