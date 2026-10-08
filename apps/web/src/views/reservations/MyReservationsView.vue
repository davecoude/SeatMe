<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { fetchMyReservations, checkInReservation, cancelReservation } from '@/services/reservations'
import { useToast } from '@/composables/useToast'
import {
  CalendarDays,
  Clock,
  MapPin,
  LogIn,
  XCircle,
  CheckCircle,
  AlertCircle,
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
}

const reservations = ref<Reservation[]>([])
const loading = ref(true)
const activeFilter = ref('all')
const toast = useToast()

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Activas' },
  { key: 'past', label: 'Historial' },
]

onMounted(async () => {
  await loadReservations()
})

/**
 * Carga las reservas pertenecientes al usuario autenticado.
 *
 * Actualiza el estado de carga mientras se realiza la petición y
 * muestra una notificación si ocurre un error.
 *
 * @returns Una promesa que se resuelve cuando las reservas han sido cargadas.
 */
async function loadReservations() {
  try {
    loading.value = true
    reservations.value = await fetchMyReservations()

    await nextTick()
    gsap.fromTo(
      '.reservation-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
    )
  } catch (e: any) {
    toast.error('Error al cargar reservas')
  } finally {
    loading.value = false
  }
}

const filteredReservations = computed(() => {
  if (activeFilter.value === 'active') {
    return reservations.value.filter((r) =>
      ['PENDING', 'CONFIRMED', 'CHECKED_IN'].includes(r.status),
    )
  }

  if (activeFilter.value === 'past') {
    return reservations.value.filter((r) => ['COMPLETED', 'CANCELLED'].includes(r.status))
  }

  return reservations.value
})

async function setFilter(key: string) {
  activeFilter.value = key

  await nextTick()
  gsap.fromTo(
    '.reservation-card',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
  )
}

/**
 * Realiza el check-in de una reserva.
 *
 * Después de registrar el check-in, actualiza la lista de reservas
 * para reflejar el nuevo estado.
 *
 * @param id - Identificador de la reserva.
 */
async function handleCheckIn(id: string) {
  try {
    await checkInReservation(id)
    toast.success('Check-in realizado')
    await loadReservations()
  } catch (e: any) {
    toast.error(e.response?.data?.error || 'Error al hacer check-in')
  }
}

/**
 * Cancela una reserva.
 *
 * Después de cancelar la reserva, actualiza la lista de reservas
 * para reflejar el nuevo estado.
 *
 * @param id - Identificador de la reserva que se desea cancelar.
 */
async function handleCancel(id: string) {
  try {
    await cancelReservation(id)
    toast.success('Reserva cancelada')
    await loadReservations()
  } catch (e: any) {
    toast.error(e.response?.data?.error || `Error al cancelar`)
  }
}

/**
 * Obtiene la configuración visual correspondiente al estado de una reserva.
 *
 * @param status - Estado actual de la reserva.
 * @returns Objeto con las clases CSS para el color y borde, y la etiqueta
 *          que se mostrará al usuario.
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
 * Formatea una fecha para mostrarla en formato localizado de Colombia.
 *
 * @param dateStr - Fecha en formato de cadena.
 *
 * @returns Fecha formateada en español con día de la semana, año,
 *          mes y día.
 */
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Determina la clase CSS necesaria para definir el tamaño de una tarjeta
 * dentro del diseño tipo mosaico.
 *
 * @param index - Índice de la tarjeta dentro de la colección.
 * @returns Clase CSS para ampliar la tarjeta o una cadena vacía si mantiene
 *          su tamaño estándar.
 */
function getMosaicClass(index: number): string {
  const pattern = index % 5
  if (pattern === 0) return 'sm:col-span-2'
  if (pattern === 3) return 'sm:col-span-2'
  return ''
}
</script>

<template>
  <div class="pt-16 min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p class="mt-1 text-sm text-gray-500">Consulta, gestiona y haz check-in de tus reservas</p>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="filter in filters"
          :key="filter.key"
          @click="setFilter(filter.key)"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeFilter === filter.key
              ? 'bg-primary-700 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700',
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredReservations.length === 0" class="text-center py-16">
        <CalendarDays class="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p class="font-medium text-gray-500">No hay reservas para mostrar</p>
        <p class="text-sm text-gray-400 mt-1">Tus reservas aparecerán aquí cuando realices una</p>
      </div>

      <!-- Reservations mosaic -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(reservation, index) in filteredReservations"
          :key="reservation.id"
          :class="[
            'reservation-card bg-white rounded-xl border p-5 flex flex-col justify-between',
            getStatusConfig(reservation.status).border,
          ]"
        >
          <!-- Top: code + status -->
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

            <!-- Details -->
            <div class="space-y-2">
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
            v-if="reservation.status === 'CONFIRMED' || reservation.status === 'PENDING'"
            class="flex gap-2 mt-4 pt-4 border-t border-gray-100"
          >
            <button
              v-if="reservation.status === 'CONFIRMED'"
              @click="handleCheckIn(reservation.id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              <LogIn class="w-4 h-4" />
              Check-in
            </button>
            <button
              @click="handleCancel(reservation.id)"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircle class="w-4 h-4" />
              Cancelar
            </button>
          </div>

          <!-- Completed/Cancelled indicator -->
          <div
            v-else-if="reservation.status === 'COMPLETED'"
            class="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-100 text-sm text-green-600"
          >
            <CheckCircle class="w-4 h-4" />
            Reserva completada
          </div>
          <div
            v-else-if="reservation.status === 'CANCELLED'"
            class="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-100 text-sm text-red-500"
          >
            <AlertCircle class="w-4 h-4" />
            Reserva cancelada
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
