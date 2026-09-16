<script setup lang="ts">
  import { ref } from "vue"
  import { useRouter } from "vue-router"
  import { useAuthStore } from "@/stores/auth"

  const router = useRouter()
  const auth = useAuthStore()

  const email = ref("")
  const password = ref("")
  const firstName = ref("")
  const lastName = ref("")
  const error = ref("")
  const loading = ref(false)

  async function handleRegister() {
    try {
      loading.value = true
      error.value = ""
      await auth.register(email.value, password.value, firstName.value, lastName.value)
      router.push("/login")

    } catch (e: any) {
      error.value =  e.response?.data?.error || "Error al registrarse"
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
          <input
            v-model="firstName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jhon"
          />
        </div>
      </div>

      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
          <input
            v-model="lastName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Doe"
          />
        </div>
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Crea una contraseña</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button @click="handleRegister" :disabled="loading" class="w-full py-2 px-4 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
        {{ loading ? "Registrando..." : "Enviar" }}
      </button>

      <p class="text-center text-sm text-gray-600">
        <RouterLink to="/login" class="text-blue-600 hover:underline">Ya tengo una cuenta</RouterLink>
      </p>

    </div>
  </div>
</template>