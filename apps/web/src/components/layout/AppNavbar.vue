<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  const route = useRouter()
  const auth = useAuthStore()

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
    </div>

    <button
      @click="handleLogout"
      class="text-sm text-gray-500 hover:text-red-600"
    >
      Cerrar Sesion
    </button>

  </nav>
</template>