<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  Monitor,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from 'lucide-vue-next'

const route = useRouter()
const auth = useAuthStore()
const mobileOpen = ref(false)

/**
 * Cierra la sesión del usuario y redirige a la página de inicio de sesión.
 * Ejecuta el método logout() del servicio de autenticación para
 * finalizar la sesión actual y, posteriormente, redirige al usuario
 * a la ruta de inicio de sesión.
 * @returns void
 */
function handleLogout() {
  auth.logout()
  route.push('/')
}

/**
 * Navega a una ruta específica y cierra el menú móvil.
 *
 * Se utiliza para centralizar la navegación desde elementos de la interfaz
 * que también requieren cerrar el menú responsive antes de cambiar de vista.
 *
 * @param path - Ruta de destino a la que se navegará.
 *
 * @example
 * navigate('/dashboard')
 */
function navigate(path: string) {
  mobileOpen.value = false
  route.push(path)
}
</script>

<template>
  <nav class="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
    <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <RouterLink to="/dashboard" class="text-xl font-bold text-primary-700">SeatMe</RouterLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            to="/dashboard"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <LayoutDashboard class="w-4 h-4" />
            Dashboard
          </RouterLink>

          <RouterLink
            to="/my-reservations"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <CalendarDays class="w-4 h-4" />
            Mis Reservas
          </RouterLink>

          <template v-if="auth.isAdmin">
            <div class="w-px h-6 bg-gray-200 mx-2" />

            <RouterLink
              to="/admin/zones"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Map class="w-4 h-4" />
              Zonas
            </RouterLink>

            <RouterLink
              to="/admin/desks"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Monitor class="w-4 h-4" />
              Escritorios
            </RouterLink>

            <RouterLink
              to="/admin/reservations"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ClipboardList class="w-4 h-4" />
              Reservas
            </RouterLink>
          </template>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Logout desktop -->
        <div class="flex items-center gap-3">
          <!-- User name -->
          <span v-if="auth.user" class="hidden sm:block text-sm font-bold text-gray-500">
            Hola {{ auth.user.firstName }}!
          </span>

          <!-- Logout desktop -->
          <button
            @click="handleLogout"
            class="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut class="w-4 h-4" />
            Cerrar sesión
          </button>

          <!-- Hamburger mobile -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X v-if="mobileOpen" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
      <div v-if="auth.user" class="px-3 py-2 mb-2 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ auth.user.firstName }}</p>
        <p class="text-xs text-gray-500">
          {{ auth.user.role === 'ADMIN' ? 'Administrador' : 'Miembro' }}
        </p>
      </div>

      <button
        @click="navigate('/dashboard')"
        class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <LayoutDashboard class="w-4 h-4" />
        Dashboard
      </button>

      <button
        @click="navigate('/my-reservations')"
        class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <CalendarDays class="w-4 h-4" />
        Mis Reservas
      </button>

      <template v-if="auth.isAdmin">
        <div class="h-px bg-gray-200 my-2" />

        <button
          @click="navigate('/admin/zones')"
          class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Map class="w-4 h-4" />
          Zonas
        </button>

        <button
          @click="navigate('/admin/desks')"
          class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Monitor class="w-4 h-4" />
          Escritorios
        </button>

        <button
          @click="navigate('/admin/reservations')"
          class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ClipboardList class="w-4 h-4" />
          Reservas
        </button>
      </template>

      <div class="h-px bg-gray-200 my-2" />

      <button
        @click="handleLogout"
        class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut class="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>
