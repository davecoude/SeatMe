<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import {
  fetchAllReservations,
  confirmReservation,
  completeReservation,
  cancelReservation,
} from '@/services/reservations'
import { useToast } from '@/composables/useToast'
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  ClipboardList,
  Search,
} from 'lucide-vue-next'
import gsap from 'gsap'
import AppSpinner from '@/components/ui/AppSpinner.vue'

interface Reservation {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  checkInAt: string | null
  desk: {
    id: string
    code: string
    zone: {
      name: string
      floor: number
    }
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

const reservations = ref<Reservation[]>([])
const loading = ref(true)
const activeFilter = ref('all')
const toast = useToast()
const searchQuery = ref('')

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'active', label: 'Activas' },
  { key: 'past', label: 'Historial' },
]

onMounted(async () => {
  await loadReservations()
})

/**
 * Carga todas las reservas y aplica la animación de entrada a las tarjetas
 * una vez que el DOM ha sido actualizado.
 *
 * Gestiona el estado de carga durante la operación y muestra una notificación
 * si ocurre un error al obtener las reservas.
 */
async function loadReservations() {
  try {
    loading.value = true
    reservations.value = await fetchAllReservations()

    await nextTick()
    gsap.fromTo(
      '.reservation-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' },
    )
  } catch (e: any) {
    toast.error('Error al cargar reservas')
  } finally {
    loading.value = false
  }
}

/**
 * Filtra las reservas según el estado seleccionado y el texto de búsqueda.
 *
 * Los filtros disponibles agrupan las reservas en pendientes, activas
 * y finalizadas. La búsqueda permite encontrar reservas por usuario,
 * escritorio, zona o fecha.
 */
const filteredReservations = computed(() => {
  let result = reservations.value

  switch (activeFilter.value) {
    case 'pending':
      result = result.filter((r) => r.status === 'PENDING')
      break
    case 'active':
      result = result.filter((r) => ['CONFIRMED', 'CHECKED_IN'].includes(r.status))
      break
    case 'past':
      result = result.filter((r) => ['COMPLETED', 'CANCELLED'].includes(r.status))
      break
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (r) =>
        r.user.firstName.toLowerCase().includes(query) ||
        r.user.lastName.toLowerCase().includes(query) ||
        r.desk.code.toLowerCase().includes(query) ||
        r.desk.zone.name.toLowerCase().includes(query) ||
        formatDate(r.date).toLowerCase().includes(query),
    )
  }

  return result
})

/**
 * Cambia el filtro activo y ejecuta nuevamente la animación de las tarjetas
 * después de actualizar el contenido mostrado.
 *
 * @param key - Identificador del filtro seleccionado.
 */
async function setFilter(key: string) {
  activeFilter.value = key

  await nextTick()
  gsap.fromTo(
    '.reservation-card',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' },
  )
}

/**
 * Confirma una reserva y actualiza la lista después de completar la operación.
 *
 * @param id - Identificador de la reserva que se desea confirmar.
 */
async function handleConfirm(id: string) {
  try {
    await confirmReservation(id)
    toast.success('Reserva confirmada')
    await loadReservations()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al confirmar')
  }
}

/**
 * Marca una reserva como completada y actualiza la lista de reservas.
 *
 * @param id - Identificador de la reserva que se desea completar.
 */
async function handleComplete(id: string) {
  try {
    await completeReservation(id)
    toast.success('Reserva completada')
    await loadReservations()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al completar')
  }
}

/**
 * Cancela una reserva y actualiza la lista después de completar la operación.
 *
 * @param id - Identificador de la reserva que se desea cancelar.
 */
async function handleCancel(id: string) {
  try {
    await cancelReservation(id)
    toast.success('Reserva cancelada')
    await loadReservations()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al cancelar')
  }
}

/**
 * Obtiene la configuración visual asociada a un estado de reserva.
 *
 * @param status - Estado actual de la reserva.
 * @returns Clases CSS, etiqueta visible y borde correspondientes al estado.
 */
function getStatusConfig(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Pendiente',
        border: 'border-yellow-200',
      }
    case 'CONFIRMED':
      return { color: 'bg-blue-100 text-blue-800', label: 'Confirmada', border: 'border-blue-200' }
    case 'CHECKED_IN':
      return {
        color: 'bg-purple-100 text-purple-800',
        label: 'En uso',
        border: 'border-purple-200',
      }
    case 'COMPLETED':
      return {
        color: 'bg-green-100 text-green-800',
        label: 'Completada',
        border: 'border-green-200',
      }
    case 'CANCELLED':
      return { color: 'bg-red-100 text-red-800', label: 'Cancelada', border: 'border-red-200' }
    default:
      return { color: 'bg-gray-100 text-gray-800', label: status, border: 'border-gray-200' }
  }
}

/**
 * Convierte una fecha en formato legible para Colombia.
 *
 * @param dateStr - Fecha en formato compatible con el constructor Date.
 * @returns Fecha formateada con día de la semana, año, mes y día.
 */
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p class="mt-1 text-sm text-gray-500">Administra todas las reservas del sistema</p>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="setFilter(filter.key)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
            activeFilter === filter.key
              ? 'bg-primary-700 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700',
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Search bar -->
      <div class="relative mb-6">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, escritorio, zona o fecha..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <div v-else-if="filteredReservations.length === 0" class="text-center py-16">
        <ClipboardList class="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p class="font-medium text-gray-500">No hay reservas para mostrar</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="reservation in filteredReservations"
          :key="reservation.id"
          :class="[
            'reservation-card bg-white rounded-xl border p-5 flex flex-col justify-between',
            getStatusConfig(reservation.status).border,
          ]"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-lg font-bold text-gray-900">{{ reservation.desk.code }}</span>
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  getStatusConfig(reservation.status).color,
                ]"
              >
                {{ getStatusConfig(reservation.status).label }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <User class="w-4 h-4 text-gray-400 shrink-0" />
                {{ reservation.user.firstName }} {{ reservation.user.lastName }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <MapPin class="w-4 h-4 text-gray-400 shrink-0" />
                {{ reservation.desk.zone.name }} · Piso {{ reservation.desk.zone.floor }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays class="w-4 h-4 text-gray-400 shrink-0" />
                {{ formatDate(reservation.date) }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <Clock class="w-4 h-4 text-gray-400 shrink-0" />
                {{ reservation.startTime }} - {{ reservation.endTime }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            v-if="
              reservation.status === 'PENDING' ||
              reservation.status === 'CONFIRMED' ||
              reservation.status === 'CHECKED_IN'
            "
            class="flex gap-2 mt-4 pt-4 border-t border-gray-100"
          >
            <button
              v-if="reservation.status === 'PENDING'"
              @click="handleConfirm(reservation.id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              <CheckCircle class="w-4 h-4" />
              Confirmar
            </button>
            <button
              v-if="reservation.status === 'CHECKED_IN'"
              @click="handleComplete(reservation.id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              <CheckCircle class="w-4 h-4" />
              Completar
            </button>
            <button
              v-if="reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'"
              @click="handleCancel(reservation.id)"
              class="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircle class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
