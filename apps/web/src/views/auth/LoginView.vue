<script setup lang="ts">
  import { ref } from "vue"
  import { useRouter } from "vue-router"
  import { useAuthStore } from "@/stores/auth"

  const router = useRouter()
  const auth  = useAuthStore()

  const email = ref("")
  const password = ref("")
  const error = ref("")
  const loading = ref(false)

  async function handleLogin() {
    try {
      
      loading.value = true
      error.value = ""
      await auth.login(email.value, password.value)
      router.push("/dashboard")

    } catch (e: any) {
      error.value = e.response?.data?.error || "Error al iniciar sesion"
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">SeatMe</h1>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button @click="handleLogin" :disabled="loading" class="w-full py-2 px-4 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
        {{ loading ? "Ingresando..." : "Iniciar sesion" }}
      </button>

      <p class="text-center text-sm text-gray-600">
        No tienes cuenta?
        <RouterLink to="/register" class="text-blue-600 hover:underline">Registrate</RouterLink>
      </p>

    </div>
  </div>
</template>