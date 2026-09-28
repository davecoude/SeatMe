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
  const errors = ref<{ [key: string]: string}>({})

  /**
   * Valida los datos ingresados en el formulario de registro.
   *
   * Comprueba que el nombre y apellido no estén vacíos, que el correo
   * tenga un formato básico válido y que la contraseña cumpla con los
   * requisitos mínimos de seguridad.
   *
   * Los errores encontrados se almacenan en el objeto de errores del formulario.
   *
   * @returns `true` si todos los campos son válidos; `false` si existe
   *          al menos un error de validación.
   */
  function validate(): boolean {
    errors.value = {}

    if(!firstName.value.trim()) {
      errors.value.firstName = 'Nombre requerido'
    }
    if(!lastName.value.trim()) {
      errors.value.lastName = 'Apellido requerido'
    }
    if(!email.value.includes('@') || !email.value.includes('.')) {
      errors.value.email = 'Email invalido'
    }

    if(password.value.length < 8) {
      errors.value.password = 'Minimo 8 caracteres'
    } else if(!/[A-Z]/.test(password.value)) {
      errors.value.password = 'Debe contener al menos una mayuscula'
    } else if(!/[0-9]/.test(password.value)) {
      errors.value.password = 'Debe contener al menos un numero'
    }

    return Object.keys(errors.value).length === 0
  }

  async function handleRegister() {
    if(!validate()) return

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
            :class="['w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Jhon"
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600"> {{ errors.firstName }}</p>
        </div>
      </div>

      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
          <input
            v-model="lastName"
            type="text"
            :class = "['w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Doe"
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600"> {{ errors.lastName }}</p>
        </div>
      </div>

      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            :class="['w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.email ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="tu@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600"> {{ errors.email }}</p>
        </div>
      </div>

      <div class="space-y-4 mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Crea una contraseña</label>
        <input
          v-model="password"
          type="password"
          :class="['w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.email ? 'border-red-500' : 'border-gray-300'
            ]"
          placeholder="••••••••"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600"> {{ errors.password }}</p>
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