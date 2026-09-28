<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  const route = useRouter()
  const auth = useAuthStore()

  /**
   * Cierra la sesión del usuario y redirige a la página de inicio de sesión.
   * Ejecuta el método logout() del servicio de autenticación para
   * finalizar la sesión actual y, posteriormente, redirige al usuario
   * a la ruta de inicio de sesión.
   * @returns void
  */
  function handleLogout() {
    auth.logout()
    route.push('/login')
  }
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-6">
      <span class="text-xl font-bold text-blue-600">SeatMe</span>

      <RouterLink
        to="/dashboard"
        class="text-sm text-gray-600 hover:text-blue-600"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        to="/my-reservations"
        class="text-sm text-gray-600 hover:text-blue-600"
      >
        Mis reservas
      </RouterLink>

      <div v-if="auth.isAdmin" class="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
        <RouterLink
        to="/admin/zones"
        class="text-sm text-gray-600 hover:text-blue-600"
        >
          Zonas
        </RouterLink>

        <RouterLink
        to="/admin/desks"
        class="text-sm text-gray-600 hover:text-blue-600"
        >
          Escritorios
        </RouterLink>
        
        <RouterLink
        to="/admin/reservations"
        class="text-sm text-gray-600 hover:text-blue-600"
        >
          Reservas
        </RouterLink>
      </div>
    </div>

    <button
      @click="handleLogout"
      class="text-sm text-gray-500 hover:text-red-600"
    >
      Cerrar Sesion
    </button>

  </nav>
</template>